import { Dropzone } from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

const dDefaultMessag = document.querySelector('#dDefaultMessag').value // 'Puja la teva imatge aquí'
const dRemoveFile = document.querySelector('#dRemoveFile').value // 'Esborrar Fitxer',
const dMaxFilesExceeded = document.querySelector('#dMaxFilesExceeded').value // 'El límit és sols 1 Fitxer',

Dropzone.options.imagen = {
    dictDefaultMessage: dDefaultMessag,
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: dRemoveFile,
    dictMaxFilesExceeded: dMaxFilesExceeded,
    headers: {
        'CSRF-Token': token
    },
    paramName: 'imatge',
    init: function() {
        const dropzone = this
        const btnPublicar = document.querySelector('#publicar')

        btnPublicar.addEventListener('click', function() {
            dropzone.processQueue()
        })

        dropzone.on('queuecomplete', function() {
            if(dropzone.getActiveFiles().length == 0) {
                window.location.href = '/propietats/llistat-propietats'
            }
        })

    }
}

/*

Dropzone.prototype.defaultOptions.dictDefaultMessage = "Drop files here to upload";
Dropzone.prototype.defaultOptions.dictFallbackMessage = "Your browser does not support drag'n'drop file uploads.";
Dropzone.prototype.defaultOptions.dictFallbackText = "Please use the fallback form below to upload your files like in the olden days.";
Dropzone.prototype.defaultOptions.dictFileTooBig = "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.";
Dropzone.prototype.defaultOptions.dictInvalidFileType = "You can't upload files of this type.";
Dropzone.prototype.defaultOptions.dictResponseError = "Server responded with {{statusCode}} code.";
Dropzone.prototype.defaultOptions.dictCancelUpload = "Cancel upload";
Dropzone.prototype.defaultOptions.dictCancelUploadConfirmation = "Are you sure you want to cancel this upload?";
Dropzone.prototype.defaultOptions.dictRemoveFile = "Remove file";
Dropzone.prototype.defaultOptions.dictMaxFilesExceeded = "You can not upload any more files.";

*/