import {Dropzone} from 'dropzone'

const token = document.querySelector('meta[name="csrfToken"]').getAttribute('content')

Dropzone.options.image = { //image viene del id del form donde esta funcionando dropzone
    dictDefaultMessage: 'Arrastra tus imagenes aquí',
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: true,
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar archivo',
    dictMaxFilesExceeded: 'El límite es 1 archivo',
    headers: {
        'CSRF-Token': token
    }
}