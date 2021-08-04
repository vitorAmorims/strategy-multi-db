class notImplementedException extends Error {
    constructor(){
        super("Not Implemented Exception");
    }
}

class Icrud{
    create(item){
        throw new notImplementedException();
    }
    read(query){
        throw new notImplementedException();
    }
    update(id, item){
        throw new notImplementedException();
    }
    delete(id){
        throw new notImplementedException();
    }
    isConnected(){
        throw new notImplementedException();
    }
    connect(){
        throw new notImplementedException();
    }
    defineModel(){
        throw new notImplementedException();
    }
}

module.exports = Icrud;