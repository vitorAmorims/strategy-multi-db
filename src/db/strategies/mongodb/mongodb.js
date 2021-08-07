const ICrud = require("./../interfaces/interfaceCrud");
const Mongoose = require("mongoose");
const STATUS = {
    0: "Desconectado",
    1: "Conectado",
    2: "Conectando",
    3: "Desconectando"
}

class MongoDBAbstract extends ICrud {
  constructor(connection, schema) {
    super();
    this._schema = schema
    this._connection = connection
  }
  async isConnected() {
      const state = STATUS[this._connection.readyState]
      if (state === 'Conectado') return state
      if (state !== 'Conectando') return state
      await new Promise(resolve => setTimeout(resolve, 1000))
      return await STATUS[this._connection.readyState]
  }
  static connect() {
    Mongoose.connect(
      "mongodb://vitoramorim:minhasenhasecreta@localhost:27017/herois",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      function (error) {
        if (!error) return;
        console.log("falha na conexão", error);
      }
    );

    const connection = Mongoose.connection
    connection.once("open", () => console.log("database rodando"));
    return connection
  }
  create(item) {
    return this._schema.create(item)
  }
  read(item = {}, Nskip, Nlimit){
    return this._schema.find(item).skip(Nskip).limit(Nlimit)
  }
  async update(id, item){
    await this._schema.updateOne({ _id: id }, { $set: item }).catch(
      error => {
         console.log(error);
       }
    );
  }
  async delete(id){
    const result = await this._schema.deleteOne({ _id: id }).catch(
      error => {
        console.log(error);
      }
    )
    return result
  }  
}

module.exports = MongoDBAbstract;
