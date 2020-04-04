const express = require('express')
const keys = require('./config/key');
const path = require('path')
const stripe = require('stripe')(keys.stripeSecretKey)
const bodyParser = require('body-parser')
const hbs = require('hbs')

const app = express()
const port = process.env.PORT || 3000

// define express path
const publicPathDir = path.join(__dirname, '/public')
const viewPath = path.join(__dirname, './template/views') //for rename view folder->template
const partialPath = path.join(__dirname, './template/partials') //for partial(header,footer)

//define hbs config

app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialPath)

//define body-parser middleware config
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

//set express for static file
app.use(express.static(publicPathDir))


app.get('/', (req, res) => {
 res.render('index',
  {
    stripePublishableKey: keys.stripePublishableKey
  })
})

// app.get('/success', (req, res) => {
//  res.render('success')
// })


app.post('/charge', (req, res) => {
const amount = 2500;
  
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer => stripe.charges.create({
    amount,
    description: 'Web Development Ebook',
    currency: 'inr',
    customer: customer.id
  }))
  .then(charge => res.render('success'));
});



app.listen(port, () => {
console.log(`express server on in port ${port}`)
})