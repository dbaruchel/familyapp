Answers = new Mongo.Collection("answers");

if (Meteor.isClient) {

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  Template.body.helpers({
    'answers': function() {
      return Answers.find({});
    },
  });

  Template.body.events({
    'click .new-answer-btn': function (e, t) {
      t.$('.me-or-guest').toggle();
    },

    'click .add-me': function (event, t) {
      // Insert a member into the collection
      Answers.insert({
        name: Meteor.user().username,
        status:'-',
        message:'',
        createdAt: new Date(), // current time
        owner: Meteor.userId(),
      });
      t.$('.me-or-guest').css('display','none');
    },

    // 'submit .new-member': function (event) {
    //   // Prevent default browser form submit
    //   event.preventDefault();
 
    //   // Get value from form element
    //   var text = event.target.text.value;
 
    //   // Insert a member into the collection
    //   Members.insert({
    //     name: text,
    //     status:'-',
    //     message:'',
    //     createdAt: new Date(), // current time
    //     owner: Meteor.userId(),
    //     username: Meteor.user().username,
    //   });
 
    //   // Clear form
    //   event.target.text.value = "";
    // },
  });

  Template.Answer.helpers({
    'currentUserId': function() {
      console.log(Meteor.userId());
      return Meteor.userId();
    },
  });

  Template.Answer.events({
    'click .yes-btn': function () {
      Answers.update(this._id, {
        $set: {status: "Yes"}
      });
    },

    'click .no-btn': function () {
      Answers.update(this._id, {
        $set: {status: "No"}
      });
    },

    'click .maybe-btn': function () {
      Answers.update(this._id, {
        $set: {status: "Maybe"}
      });
    },

    'click .status': function () {
      if (Meteor.userId() == this.owner){
        Answers.update(this._id, {
          $set: {status: "-"}
        });
      }
    },

    'click .edit-btn': function (e, t) {
      t.$('.edit-dropdown').toggle();
    },

    'click .remove': function () {
      Answers.remove(this._id);
    },

    'click .edit-message': function(e,t) {
      t.$('.edit-message').css('display', 'none');
      t.$('.message').css('display', 'none');
      t.$('.edit-message-form').css('display', 'inline-block');
    },

    'click .cancel-edit': function(e,t) {
      t.$('.edit-message-form').css('display', 'none');
      t.$('.edit-message').css('display', 'inline-block');
      t.$('.message').css('display', 'inline-block');
    },

    'submit .edit-message-form': function (event, t) {
      // Prevent default browser form submit
      event.preventDefault();
    
      // Get value from form element
      var text = event.target.message.value;
    
      // Update message
      Answers.update(this._id, {
        $set: {message: text}
      });

      t.$('.edit-message-form').css('display', 'none');
      t.$('.edit-message').css('display', 'inline-block');
      t.$('.message').css('display', 'inline-block');
    },
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
