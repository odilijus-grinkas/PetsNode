# INFO
Run query in schemaWithEntries to create the database with entries present
Line 19 in app.js assumes connection name 'root' and password 'root'

# TODO:

## Views
1. `index.esj` - displays 2 random pets to vote for. Contains button "add pet", "manage pets", "stats". Clicking a pet gives "This many % agree with you"
2. `create.esj` - displays form to fill out to add a new pet to DB.
3. `manage.esj` - displays a list of all pets. Each one has a button "UPDATE" and "DELETE" and another "add pet" button.
4. `update.esj` - displays page for 1 pet that can be used to make updates (PUT requests). This is returned after "UPDATE" button is pressed.

## Routes
1. `/` - loads index.esj  

2. `/create` - loads createPet.esj  
    2.1 `/store` - POST request when form is submitted in createPet

3. `/manage` - loads managePets.esj  
   3.1 `/manage/:id` - returns editor.esj after UPDATE is pressed on pet  
         3.1.1 `/manage/:id/update` - PUT request when update is submitted button is pressed  
   3.2 `/manage/:id/delete` - DELETE request if "DELETE" button is pressed  

4. `/vote:petid1-petid2` - sent after a pet has been clicked. Adds vote where id1 is winner & id2 is loser.

5. `/stats` - for various statistics:
- dienos nugalėtojas
- savaitės nugalėtojas
- mėnesio nugalėtojas
- rūšys pagal augintinių kiekį
- rūšys pagal laimėjimų skaičių 
- sugalvoti savo statistikų (least voted pet)

## Specifics

1. Add sessions that keep track of which pets have been voted for.
2. Add stats for the 2 pets that were voted for that specifies which has more votes. It also shows next pets to vote for.
3. Ability to add species.