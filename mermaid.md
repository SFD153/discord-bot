graph LR
    msgEvent[event handler detects message] --> commandReducer{commandReducer}

    commandReducer -->|msg is in a workshop| handleWorkshopMsg[handleWorkshopMsg]
    commandReducer -->|!test| command.test[command.test]
    commandReducer -->|!api| updateCardAPI[updateCardAPI]
    commandReducer -->|!pickwinner| command.pickwinner[command.pickwinner]
    commandReducer -->|!points| command.points[command.points]
    commandReducer -->|!leaderboard| command.leaderboard[command.leaderboard]
    commandReducer -->|!tune| command.tune[command.tune]
    commandReducer -->|!setpoints| command.setpoints[command.setpoints]

    updateCardAPI --> addCard[addCard]
    updateCardAPI --> logEvent[logEvent]
    command.pickwinner.insubgraph[command.pickwinner] --> logEvent[logEvent]
    command.points --> logEvent[logEvent]

    command.pickwinner.insubgraph[command.pickwinner] --> Permissions[Permissions.checkRole]
    command.pickwinner.insubgraph[command.pickwinner] --> randomFeedback[randomFeedback]
    command.pickwinner.insubgraph[command.pickwinner] --> feedbackEmbed[feedbackEmbed]


    command.points --> parseTimeParameter[parseTimeParameter]