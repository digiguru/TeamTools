Comfort Zone


Actions : [
    {type:"SET_FOCUS", area:"comfort"},
        // Set focus to true on this zone, and all others to false.
    {type:"SELECT_USER", user:"Adam"},
        // Sets currentUser, and therefor hides the user choice menu
    {type:"CHOOSE_ZONE", user:"Adam", area:"Stretch", distance: "165"},
        // Adds to UserChoices, and sets currentUser to empty
    {type:"SHOW_CHOICES"}   
        // Set "showUserChoices" to true
]
