const express = require("express")
const {v4:uuidV4} = require("uuid")
const { verifyIfExistsAccountCPF } = require("./middlewares/verifyIfExistsAccountCPF")
const { getBalance } = require("./utils/getBalance")

const app = express()
app.use(express.json())

const customers = []

//criando o client
app.post("/account", (req, res) => {
  const {name, cpf} = req.body

  //verificando se o cliente já não existe
  const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf )

  if(customerAlreadyExists){
    return res.status(400).json({
      error: "customer already exists!!"
    })
  }

  // add o cliente
  customers.push({
    id: uuidV4(),
    name,
    cpf,
    statement: []
  })

  return res.status(201).send()

})

app.use(verifyIfExistsAccountCPF(customers))

app.get("/statement",(req, res) => {
  const {customer} = req

  return res.json(customer.statement)
})

//cria um deposito
app.post("/deposit", (req, res) => {
  const {description, amount} = req.body

  const {customer} = req

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credito",
  }

  customer.statement.push(statementOperation)

  return res.status(201).send()
})

//saque
app.post("/withdraw", (req, res) => {
  const { customer } = req
  const { amount } = req.body
  
  const balance = getBalance(customer.statement)

  if(balance < amount) {
    return res.status(400).send({error: 'Dinheiro insuficiente'})
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: 'debit '
  }

  customer.statement.push(statementOperation)

  return res.status(201).send()
})

//date
app.get("/statement/date",(req, res) => {
  const {customer} = req
  const {date} = req.query

  const dateFormat = new Date(date + " 00:00")

  //transformando date pra string
  const statement = customer.statement.filter((statement) => 
    statement.created_at.toDateString() == new Date(dateFormat).toDateString()
  )

  return res.json(statement)
})

app.listen(3333)