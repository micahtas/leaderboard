PlayersList = new Mongo.Collection('players');

console.log("Hello World");

if(Meteor.isClient)
{
    //this code only runs on client
    Template.leaderboard.helpers(
        {
            'player': function() {
                return PlayersList.find();
            },
        }
    );

    Template.leaderboard.events(
        {
            'click': function(){
                console.log("You clicked something");
            }
        }
    );
}

if(Meteor.isServer)
{
    console.log("Hello Server");
}
