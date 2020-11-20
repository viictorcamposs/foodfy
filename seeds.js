const faker = require('faker');
const { hash } = require('bcryptjs');

const User = require('./src/app/models/User');
const Recipe = require('./src/app/models/Recipe');
const Chef = require('./src/app/models/Chef');
const File = require('./src/app/models/File');


async function createAdminAccount() {
  try {
    const password = await hash('12345', 8); 
  
    const user = {
      name: 'Admin',
      email: 'admin@foodfy.com',
      password,
      is_admin: true,
    };
  
    await User.create(user);
  } catch (error) {
    console.error(error);
  }
}; 

// CHEFS (5)
async function createFakeChefs() {
  try {
    let files = [];

    while(files.length < 5) {
      files.push(await File.create({
        name: faker.image.image(),
        path: `/images/helena_rizzo.jpg`
      }));
    };

    for(let i = 0; i < 5; i++) {
      await Chef.create({
        name: faker.name.firstName(),
        file_id: files[i]
      });
    };
  } catch (error) {
    console.error(error);
  }
};

// RECIPES (10)
async function createFakeRecipes() {
  try {
    let recipes = [];

    const chefsId = await Chef.findAll();
    const usersId = await User.findAll();
  
    while(recipes.length < 10) {
      recipes.push({
        title: faker.name.title(),
        chef_id: chefsId[Math.floor(Math.random() * chefsId.length)].id,
        user_id: usersId[Math.floor(Math.random() * usersId.length)].id,
        information: faker.lorem.paragraph(Math.ceil(Math.random() * 5)),
        ingredients: `{${faker.lorem.paragraph(Math.ceil(Math.random() * 1)).split(' ')}}`,
        preparations: `{${faker.lorem.paragraph(Math.ceil(Math.random() * 1)).split(' ')}}`,
      });
    };

    const recipesPromise = recipes.map(recipe => Recipe.create(recipe));
    let recipesId = await Promise.all(recipesPromise)
  
    for(let i = 0; i < 10; i++) {
      await File.createRecipeFiles({
        filename: faker.image.image(),
        path: `/images/burger.png`,
        recipe_id: recipesId[i],
      });
    };
  } catch (error) {
    console.error(error);
  }
};


async function init() {
  await createAdminAccount();
  await createFakeChefs();
  await createFakeRecipes();
};

init();