## Usage

### Workshops
- Workshops are created using the `!tune` command in the #request-tuning channel
	- See "Interview Process"
- Workshops are where pilots can seek compartmentalized help from tuners.
- Any amount of tuners can participate, but other pilots can only view the channel
	- Each tuner that participates in a workshop will be added to a list of active tuners participating in that workshop. This is important to note for the feedback process. See "Feedback Process"
- To close a workshop, `!close` or `!forceclose` commands must be used
- Once a workshop is closed, the feedback process will begin
	- See "Feedback Process"
- Workshops are created in the "WORKSHOPS" category
	- Since each category has a limit of 50 channels, there are 3 workshop categories set in place in case of overflow

### Interview Process
- Once a user types `!tune` the interviewing process will begin
	- Users are limited to 1 workshop per person, and they will not be able to initiate another interview until the existing interview is complete. Send `!cancel` to the bot directly to be able to cancel the current interview. You will then need to restart the process from the beginning to begin the interview again.
- The interview consists of 6 questions, each with their own requirements
	-  Decklist Link
		- Answer must contain maximum of 100 characters.
		- Answer must be a valid link to one of the approved websites.
			- Archidekt
			- Moxfield
			- Tappedout
			- DeckStats
			- AetherHub
	- Commander
		- Any valid commanders are accepted, including partnered commanders
			- Partnered commanders must be sent with each commander on a separate line -OR- separated by a plus sign (+)
	- Desired Experience
		- Users are referred to the guide on the website to answer with.
		- Answer must contain a maximum of 20 characters
	- Budget
		- Answer must contain a maximum of 10 characters.
		- Left vague on purpose to allow the user to decide what they want to do.
	- Deck Goals
		- Answer must contain a maximum of 400 characters.
	- Tuning Goals
		- Answer must contain a maximum of 400 characters.
- Once the interview is complete, the user will be prompted to confirm the responses in the form of a template of what the tuning board message will look like. They can then reject or confirm. 
	- Confirm will mean the interview process is over and the workshop has been created
	- Reject will mean that the interview process must be restarted from the beginning.

### Feedback Process
- Once the `!close` command has been sent in a workshop by the chosen pilot, the feedback process will begin
	- The user will be asked for feedback on each participating tuner. Once the process is complete, the workshop will be closed. 
	
### Pro Tuner Promotion
- anytime a user gets points that would put their score past 30, they will get automatically promoted to a Pro Tuner role
	- this includes the !setpoints command

### `!close`
- Starts the process to close the workshop. Followed by a series of feedback prompts for each tuner that participated. See "Tuner Participation" for more info on this.
	- Requires role: Must be the pilot that created the workshop
		- Admins and moderators can use the `!forceclose` command.

### `!forceclose`
- Forcefully closes the workshop, which means no feedback is left for any of the pilots.
	- Meant to be used if the pilot is no longer responsive.
	- Requires role: Admin or Moderator

### `!pickwinner`
- Selects a random user as the winner, weighted by their positive feedback only
	- Requires role: Admin

### `!api`
- Fetches from the Scryfall api and populates the database. Used to fetch commander data for the commander prompt during the tuner interview
	- Requires role: Admin
	- May take a little while to complete; give it time

### `!setpoints <amount> <user mention>`
- sets the user's feedback score
	- Requires role: Admin
	- amount: any integer greater than or equal to 0
	- user mention: the user to set the points for
	- the date of the points that are added are determined by the exact time the command is sent
		- this is important to note for the !points and !leaderboard commands	
- example: `!setpoints 50 @DeckTuner`

## Known Issues
| Status |Issue |
|--|--|
|Can't fix; discord bug| When a workshop is closed, the associated channel will still remain in the channel list despite being deleted. You will be able to click on the channel, but will see a weird representation of the channel with a red bar at the bottom of the UI |
|Low priority |When using the !leaderboard command, if the top ranking user is not in the server or if they are in the server but they haven't posted a message since they've joined the server, then the command will return an empty message and log an error. Low priority issue because it's very unlikely that a top ranking user will have left the server.|
|Low priority |The bot assumes that all pilots have the "Pilot" role when they create a workshop. This comes into conflict with certain things like the pilot attempting to close the workshop. However this is alleviated by using 3rd party bots to assign the role. |
#### Note: This list is incomplete. There might be known issues that haven't been added to this list yet. 


## Testing

- [ ] tuning interview
    - [ ] correct responses for each answer
        - [ ] special attention to commanders prompt
            - [ ] double commander
        - [ ] others
    - [ ] confirm button at commander prompt and final prompt
    - [ ] try again button at commander prompt and final prompt

    - [ ] response expiration for: 
        - [ ] each regular answer
        - [ ] button prompts at commander prompt and final prompt

    - [ ] should be unable to start an interview if one is in process
    - [ ] cancel command to get out of interview at any time
    - [ ] answers that are too long will get rejected

- [ ] general workshop
    - [ ] pilots who arent the main pilot should not be able to send messages in the channel
    - [ ] workshops should increment by 1
    - [ ] tuners should be recorded in the #tuning-board channel when they send a message
        - [ ] if the pilot is a tuner, they should not be recorded in the board message

- [ ]  closing workshop
    - [ ] !close command should only work for pilot who owns the workshop
    - [ ] !forceclose
        - [ ] admin only
        - [ ] forceclose should not require pilot to be present in the server
        - [ ] forceclose will skip the feedback process
    - [ ] feedback process
        - [ ] get a prompt for each tuner that participated in the tuning
        - [ ] all three buttons should work
        - [ ] closing process gets completely cancelled upon expiration

- [ ] api command
    - [ ] only works for admins
    - [ ] make sure works

- [ ] points command
    - [ ] by default, should return all
    - [ ] cmonth, week, month parameters

- [ ] leaderboard command
    - [ ] by default, should return all
    - [ ] cmonth, week, month parameters

- [ ] pickwinner command
    - [ ] make sure works

- [ ] setpoints command
    - [ ] should reject if number isnt provided as second parameters
    - [ ] should reject if a user isnt pinged
    - [ ] should work with both increasing and decreasing values
