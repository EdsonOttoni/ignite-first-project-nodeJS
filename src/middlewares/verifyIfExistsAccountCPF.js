function verifyIfExistsAccountCPF(customers) {
  return function(req, res, next){
    const {cpf} = req.headers
  
    const customer = customers.find((customer) => customer.cpf === cpf)
  
    if(!customer){
      return res.status(404).send('account not exists')
    }

    req.customer = customer
  
    return next()
  }
}

module.exports = {
  verifyIfExistsAccountCPF
}