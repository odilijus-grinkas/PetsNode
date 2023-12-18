# TODO:

## Views
1. `index.esj` - displays 2 random pets to vote for. Contains button "add pet", "manage pets", maybe "view results", "view pets"?
2. `createPet.esj` - displays form to fill out to add a new pet to DB.
3. `managePets.esj` - displays a list of all pets. Each one has a button "UPDATE" and "DELETE" and another "add pet" button.
4. `update.esj` - displays page for 1 pet that can be used to make updates (PUT requests). This is returned after "UPDATE" button is pressed.

## routes
1. `/` - loads index.esj  
2. `/create` - loads createPet.esj  
    2.1 `/create/:id` - POST request when form is submitted in createPet
3. `/manage` - loads managePets.esj  
   3.1 `/manage/:id` - returns editor.esj after UPDATE is pressed on pet  
     3.1.1 `/manage/:id/update` - PUT request when update is submitted button is pressed  
   3.2 `/manage/:id/delete` - DELETE request if "DELETE" button is pressed  
