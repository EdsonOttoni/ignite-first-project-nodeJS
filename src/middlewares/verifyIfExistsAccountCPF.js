function verifyIfExistsAccountCPF(customers) {
  return function(req, res, next){
    //busca no header o cpf
    const {cpf} = req.headers
  
    //verificar se o cliente é o msm cliente do cpf
    const customer = customers.find((customer) => customer.cpf === cpf)
  
    if(!customer){
      return res.status(404).send('account not exists')
    }

    //define o cliente no requisição
    req.customer = customer
  
    return next()
  }
}

module.exports = {
  verifyIfExistsAccountCPF
}