PlayersList = new Mongo.Collection('players');
UserAccounts = new Mongo.Collection('user');

if(Meteor.isClient)
{
    //this code only runs on client
    Template.leaderboard.helpers(
        {
            'player': function() {
                var currentUserId = Meteor.userId();
                return PlayersList.find({}, {sort: {score: -1, name: 1}});
            },

            'selectedClass': function(){
                var playerId = this._id;
                var selectedPlayer = Session.get('selectedPlayer');

                if(playerId === selectedPlayer)
                {
                    return 'selected';
                }
            },

            'showSelectedPlayer': function(){
                var selectedPlayer = Session.get('selectedPlayer');
                return PlayersList.findOne(selectedPlayer);
            }
        }
    );

    Template.leaderboard.events(
        {
            'click li': function(){
                //console.log("You clicked li element");
                Session.set('selectedPlayer', 'session value test');
                Session.get('selectedPlayer');
            },

            'click .player': function(){
                //var playerId = "session test value";
                var playerId = this._id;
                Session.set('selectedPlayer', playerId);
            },

            'click .increment': function(){
                var selectedPlayer = Session.get('selectedPlayer');
                Meteor.call('modifyPlayerScore', selectedPlayer, 5);
            },

            'click .decrement': function(){
                var selectedPlayer = Session.get('selectedPlayer');
                Meteor.call('modifyPlayerScore', selectedPlayer, -5);
            },

            'click .remove': function(){
                var selectedPlayer = Session.get('selectedPlayer');
                Meteor.call('removePlayerData', selectedPlayer);
            }
        }
    );

    Template.addPlayerForm.events(
        {
            'submit form': function(event){
                event.preventDefault();
                var playerNameVar = event.target.playerName.value;
                Meteor.call('insertPlayerData', playerNameVar);
            }
        }
    );

    Meteor.subscribe('thePlayers');
}

if(Meteor.isServer)
{
    Meteor.publish('thePlayers', function(){
        var currentUserId = this.userId;
        return PlayersList.find({createdBy: currentUserId});
    });

    Meteor.methods({
        'insertPlayerData': function(playerNameVar){
            var currentUserId = Meteor.userId();
            PlayersList.insert(
                {
                    name: playerNameVar,
                    score: 0,
                    createdBy: currentUserId
                });
        },

        'removePlayerData': function(selectedPlayer){
            var currentUserId = Meteor.userId();
            PlayersList.remove({_id: selectedPlayer, createdBy: currentUserId});
        },

        'modifyPlayerScore': function(selectedPlayer, scoreValue){
            var currentUserId = Meteor.userId();
            PlayersList.update({_id: selectedPlayer, createdBy: currentUserId}, {$inc: {score: scoreValue}});
        }
    });
}
