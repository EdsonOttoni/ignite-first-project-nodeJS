const express = require("express")
const {v4:uuidV4} = require("uuid")
const { verifyIfExistsAccountCPF } = require("./middlewares/verifyIfExistsAccountCPF")

const app = express()
app.use(express.json())

const customers = []

app.post("/account", (req, res) => {
  const {name, cpf} = req.body

  const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf )

  if(customerAlreadyExists){
    return res.status(400).json({
      error: "customer already exists!!"
    })
  }

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

app.listen(3333)