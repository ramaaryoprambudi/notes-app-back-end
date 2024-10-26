const notes = require('./notes');
const {nanoid} = require('nanoid');

const notesHandler = (request,h) =>{
    const {title , tags , body} = request.payload;
    const id = nanoid();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNotes = {
        title,
        tags,
        body,
        id,
        createdAt,
        updatedAt
    };
    notes.push(newNotes);
    const isSuccess = notes.filter((note)=> note.id === id).length > 0;

    if(title.length > 100){
        const response = h.response({
            status : 'failed',
            message : 'Judul harus kurang dari 100 karakter',
        })
        response.code(400);
        return response;
    }
    
    if(tags.length > 3){
        const response = h.response({
            status : 'failed',
            message : 'Jumlah tag harus kurang dari 4',
        })
        response.code(400);
        return response;
    }

    if(isSuccess){
         console.log('User input:', {id ,title, tags, body,createdAt });
        const response = h.response ({
            status : 'success',
            message : 'Notes created successfully',
            data : {
                noteId : id
            },
        });
        response.code(201);
        return response;
    }
    const response = h.response({
        status : 'failed',
        message : 'Catatan Gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllNotesHandler = () => ({
    status : 'success',
    data : {
        notes
    }
});

const getNoteByIdHandler = (request, h) => {
        const {id} = request.params;

        const note = notes.filter((n)=> n.id === id)[0];

        if(note !== undefined) {
            return h.response({
              status: "success",
              data: {
                note,
              },
            }).code(200);
        }
        return  response = h.response({
            status : 'failed',
            message : 'Notes not found'
        }).code(404);
};

const updateNoteByIdHandler = (request, h) => {
    const {id} = request.params;
    const {title, tags, body} = request.payload;
    const updatedAt = new Date().toISOString();
    const noteIndex = notes.findIndex((n)=> n.id === id);

    if(tags.length > 3 ){
        const response = h.response({
            status : 'failed',
            message : 'Tags must be less than or equal to 3'
        });
        response.code(400)
        return response
    }

    if(noteIndex !== -1 ){
        notes[noteIndex] = {
            ...notes[noteIndex],
            title,
            tags,
            body,
            updatedAt,
        }
        const response = h.response({
            status : 'success',
            message : 'Notes updated successfully'
        });
        response.code(200);
        return response
    }
    const response = h.response({
        status : 'failed',
        message : 'Notes not update'
    });
    response.code(400);
    return response
}

const deleteNoteByIdHandler = (request, h) => {
    const {id} = request.params;
    const index = notes.findIndex((n)=> n.id === id);

    if(index !== -1){
        notes.splice(index, 1);
        const response = h.response({
            status : 'success',
            message : 'Notes deleted successfully'
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status : 'failed',
        message : 'Notes failed to delete'
    });
    response.code(404);
    return response;
}


module.exports = {
    notesHandler,
    getAllNotesHandler,
    getNoteByIdHandler,
    updateNoteByIdHandler,
    deleteNoteByIdHandler,
};