const express = require('express');
const app = express();

app.use(express.static('public'));
const cors = require('cors');
app.use(cors());

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Pet Box';

app.get('/', (request, response) => {
  // app.use(express.static('public'));
  // response.send('Oh hey Pet Box');
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});


app.locals.pets = [
  { id: 'a1', name: 'Rover', type: 'dog' },
  { id: 'b2', name: 'Marcus Aurelius', type: 'parakeet' },
  { id: 'c3', name: 'Craisins', type: 'cat' }
];

app.get('/api/v1/pets', (request, response) => {
  const pets = app.locals.pets;

  response.json({ pets });
});

app.get('/api/v1/pets/:id', (request, response) => {
  const { id } = request.params;
  const pet = app.locals.pets.find(pet => pet.id === id);
  if (!pet) {
   response.status(404).json({ msg: `No member with the id of ${request.params.id}`});
  }

  response.status(200).json(pet);
});

app.use(express.json());

app.post('/api/v1/pets', (request, response) => {
  const id = Date.now();
  const pet = request.body;

  for (let requiredParameter of ['name', 'type']) {
    if (!pet[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, type: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  const { name, type } = pet;
  app.locals.pets.push({ name, type, id });
  response.status(201).json(app.locals.pets);
});


app.patch('/api/v1/pets/:id', (request, response) => {
  const { id } = request.params;
  const pet = app.locals.pets.find(pet => pet.id === id);

  if(pet) {
    const updatedPet = request.body;
    app.locals.pets.forEach(pet => {
      if(pet.id === id) {
        pet.name = updatedPet.name ? updatedPet.name : pet.name;
        pet.type = updatedPet.type ? updatedPet.type : pet.type;
        
        response.json({ msg: "Member updated", pet: pet})
      }
    })
  } else {
    response.status(400).json({ mes: `No member with the id of }`})
  }
});

app.delete('/api/v1/pets/:id', (request, response) => {
  const { id } = request.params;
  const pet = app.locals.pets.find(pet => pet.id === id);
  if(!pet) {
    return response
    .status(404)
    .send({error: "Expected format: { id: <Number> }. You're missing a valid id."})
  }
  const newPets = app.locals.pets.filter(pet => pet.id !== id)
  app.locals.pets = newPets
  response.status(201).json(pet)
})

