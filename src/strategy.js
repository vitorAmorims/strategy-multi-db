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
}

class MongoDB extends Icrud{
    constructor(){
        super();
    }
    create(item){
        console.log('item foi saldo em monboDB')
    }
}

class Postgres extends Icrud{
    constructor(){
        super();
    }
    create(item){
        console.log('item foi saldo em postgres')
    }
}

class ContextStrategy{
    constructor(strategy){
        this._database = strategy
    }
    create(item){
        return this._database.create(item)
    }
    read(query){
        return this._database.read(query)
    }
    update(id, item){
        return ths._database.update(id, item)
    }
    delete(id){
        return ths._database.delete(id)
    }
}

const contextMongo = new ContextStrategy(new MongoDB);
contextMongo.create("alguma coisa")

const contextPostgres = new ContextStrategy(new Postgres);
contextPostgres.create("alguma coisa")