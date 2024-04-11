import { calcCRC32 } from '../helpers/crc32.js'
import { createCanvas } from 'canvas'

const retornIPv4Client = ( ip ) => {
    if (ip.substr(0, 7) == "::ffff:") {
        ip = ip.substr(7)
    }

    return ip
}


const generarNombreAleatori = ( digits= 3 ) => {

    const min = 1
    const max = 5
    let acodi
		   
    if( digits < min || digits > max) digits = 3
    acodi = [ ( Math.floor( Math.random() * 9 ) + 1 ) ]
    for (let i = 2; i <= digits; i++ ) { acodi = [...acodi, (Math.floor(Math.random() * 10) )] }
    return acodi;
}
  

const stringToBase64 = ( str ) => {
    return Buffer.from( str ).toString( 'base64' )
}


const base64ToString = ( base ) => {
    return Buffer.from( base , 'base64' ).toString()
}


const controlCodiCaptcha = ( cControl, codiUser, digits=3, clau ) => {
    const codiControl = JSON.parse( base64ToString( mostrarBase64( invertirCadena( cControl ) ) ) )
    const arrayDeDigits = codiUser.replace(/\s+/g, '').split('');
    for (let i = 0; i < digits; i++ ) { 
        const num = retornaNumCodiCaptcha( codiControl[i], clau)
        if ( Number( arrayDeDigits[i]) !== Number(num) ){ 
            return false
        }
    }

    return true
}
    
const retornaNumCodiCaptcha = ( numCodiCrc, clau ) => {

    for (let i = 0; i <= 9; i++ ) { 
        if (calcCRC32( clau, i ) === numCodiCrc)  return i
    }

}


const invertirCadena = (cadena) => {
    return cadena.split('').reverse().join('');
}


const ocultarBase64 = (cadena) => {
    return cadena.replace('==','*').replace('=','#')
}


const mostrarBase64 = (cadena) => {
    return cadena.replace('*','==').replace('#','=')
}


/*
const generatePNGBase64 = (cadena) => {
    // const width = 80; // Amplada de la imatge
    // const height = 30; // Alçada de la imatge
    // const canvas = createCanvas(width, height);

    const canvas = createCanvas(1, 1); // Crear un canvas temporal per mesurar el text
    let context = canvas.getContext('2d');
    context.font = '26px Arial'; // Assegurar que el font és el mateix que s'utilitzarà després

    // Mesurar la mida del text
    const metrics = context.measureText(cadena);
    const textWidth = metrics.width;

    const width = textWidth + 20; // Afegir marge a l'amplada
    const height = 30; // Alçada de la imatge
    canvas.width = width; // Actualitzar les dimensions del canvas
    canvas.height = height;

    context = canvas.getContext('2d');

    // Configurar el text
    context.fillStyle = '#000'; // Color del text
    context.font = '26px Arial'; // Estil del text
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Afegir text a la imatge
    context.fillText(cadena, width / 2, height / 2);

    // Dibuixar trama de quadrícula en diagonal
    context.beginPath();
    const step = 5; // Distància entre les línies de la quadrícula
    for (let x = -height; x < width; x += step) {
        context.moveTo(x, 0);
        context.lineTo(x + height, height);
    }
    context.strokeStyle = '#DDD'; // Color de les línies de la quadrícula
    context.stroke();

    // Retornar la imatge com a cadena Base64
    const imageDataUrl = canvas.toDataURL('image/png');
    
    return imageDataUrl;
}
*/


const generatePngRotateBase64 = (cadena, { colorRandomFont, fontRandom } = { colorRandomFont: false, fontRandom: false }) => {
    // Configuració inicial

    const colors = [ '#DDD', '#9F8170', '#E97451', '#ACE1AF', '#702963' ] // colors random de la trama
    const colorsFont = [ '#000', '#3D2B1F', '#100C08', '#006D6F', '#2F4F4F' ] // colors random de la trama
    const font = [ 'arial', 'serif', 'montserrat', 'Courier', 'Verdana' ] // colors random de la trama

    let contextFont = '26px ' + (fontRandom ? returnElementRandom( font ) : 'arial');
    
    const canvas = createCanvas(1, 1); // Canvas temporal per mesurar el text
    let context = canvas.getContext('2d');
    context.font = contextFont; // Assegura't que el font és el mateix que s'utilitzarà després
    let width = 0;

    // Estimar l'amplada necessària tenint en compte només el text i un marge
    for (let i = 0; i < cadena.length; i++) {
        const metrics = context.measureText(cadena[i]);
        width += metrics.width + 10; // Espaiat entre caràcters
    }

    const maxRotationDegrees = 20;
    const maxRotationRadians = maxRotationDegrees * (Math.PI / 180);
    // Ajustar l'alçada per comptar per la rotació màxima
    const height = 30 + (Math.sin(maxRotationRadians) * width) / cadena.length;

    // Configurar les dimensions finals del canvas
    canvas.width = width * 1.2; // Amplada extra per assegurar que tot càpiga
    canvas.height = height * .9; // Augmentar l'alçada per la rotació
    context = canvas.getContext('2d');

    // Crear trama de fons aleatòria
    let numLines = 20; // Número de línies a la trama
    context.strokeStyle = returnElementRandom(colors); // Color de la trama
    for (let i = 0; i < numLines; i++) {
        const xStart = Math.random() * canvas.width;
        const yStart = Math.random() * canvas.height;
        const xEnd = Math.random() * canvas.width;
        const yEnd = Math.random() * canvas.height;
        context.beginPath();
        context.moveTo(xStart, yStart);
        context.lineTo(xEnd, yEnd);
        context.stroke();
        context.strokeStyle = returnElementRandom(colors); // Color de la trama
    }

    /*
    context.beginPath();
    for (let x = -heightTrama; x < widthTrama; x += step) {
        context.moveTo(x, 0);
        context.lineTo(heightTrama, x + heightTrama);
        step = step + 0.3
    }
    context.strokeStyle = '#AD1'; // Color de les línies de la quadrícula
    context.stroke();
    */

    // Configuració del text i dibuix
    
    context.fillStyle = colorRandomFont ? returnElementRandom( colorsFont ) : '#000'
    context.font = contextFont;
    let xPosition = width / (2 * cadena.length); // Començar amb un marge basat en l'amplada total

    // Centrar verticalment
    const yPosition = (canvas.height / 2) + 10;

    // Dibuixar cada caràcter amb una rotació aleatòria
    for (let i = 0; i < cadena.length; i++) {
        const char = cadena[i];
        const metrics = context.measureText(char);
        const charWidth = metrics.width;
        const xCenter = xPosition + charWidth / 2;

        context.save(); // Guardar l'estat actual del context
        context.translate(xCenter, yPosition); // Moure l'origen al centre del caràcter
        const angle = (Math.random() - 0.5) * 2 * maxRotationRadians;
        context.rotate(angle);
        context.fillText(char, -charWidth / 2, 0); // Dibuixar el caràcter
        context.restore(); // Restaurar l'estat original

        xPosition += charWidth + 10; // Actualitzar la posició x per al següent caràcter
        context.fillStyle = colorRandomFont ? returnElementRandom( colorsFont ) : '#000'
    }

 
    // Crear trama davant aleatòria
    numLines = 15; // Número de línies a la trama
    //context.strokeStyle = '#DDD'; // Color de la trama
    context.strokeStyle = returnElementRandom(colors); // Color de la trama
    for (let i = 0; i < numLines; i++) {
        const xStart = Math.random() * canvas.width;
        const yStart = Math.random() * canvas.height;
        const xEnd = Math.random() * canvas.width;
        const yEnd = Math.random() * canvas.height;
        context.beginPath();
        context.moveTo(xStart, yStart);
        context.lineTo(xEnd, yEnd);
        context.stroke();
        context.strokeStyle = returnElementRandom(colors);
    }


    // Retornar la imatge com a cadena Base64
    const imageDataUrl = canvas.toDataURL('image/png');
    return imageDataUrl;
}


const genCodiControlCaptcha = ({ colorRandomFont, fontRandom } = { colorRandomFont: false, fontRandom: false }) => {

    const [ n1, n2, n3 ] = generarNombreAleatori(3)
    const [ num1, num2, num3 ] = [ calcCRC32( 'num', n1 ), calcCRC32( 'num', n2 ), calcCRC32( 'num', n3 ) ]
    const espais = [ '', ' ', '  ' ]

    const pngB64Codi = generatePngRotateBase64( 
        returnElementRandom(espais)
        +n1
        +returnElementRandom(espais)
        +n2
        +returnElementRandom(espais)
        +n3
        +returnElementRandom(espais),
        { colorRandomFont, fontRandom }
     )

    const ccontrol = invertirCadena( ocultarBase64( stringToBase64( JSON.stringify( [ num1, num2, num3 ] ) ) ) )
    return {
        ccontrol: ccontrol,
        pngB64Codi: pngB64Codi,
    }
}


const returnElementRandom = ( elements ) => {
    return elements[ Math.floor(Math.random() * (elements.length) ) ]
}

export {
    retornIPv4Client,
    generarNombreAleatori,
    stringToBase64,
    base64ToString,
    controlCodiCaptcha,
    invertirCadena,
    ocultarBase64,
    mostrarBase64,
    generatePngRotateBase64,
    genCodiControlCaptcha,
}