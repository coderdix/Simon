
function documentReady() {

    let initial = true, start = true, pass = false, session = 0,
        buttonColors  = ['green', 'red', 'yellow', 'blue'],
        gameState   = { round: 1, turn: ['simon', 'user'] },
        userArchive = [], simonArchive = [], userMoves = [],
        simonMoves  = [], n = 0, round = 1, click, pattern

    function startGame(initial, start) {
      if (initial && start)
        $('.status').text('Press start to begin')
        // Begin game by pushing start button
        $('#start').on('click', () => goSimon())
        $('#reset').on('click', () => resetGame(pattern))
    }

    function goSimon(round) {
      if (round === 11)
        winGame()
      if (round === 1)
        $('#round').text('1')
      // Tells user it's simon's turn
      $('.status').text('Simon says...')
      // Turn off start button event
      $('#start').off('click')
      // Define round
      $('#round').text(gameState.round)
      // Establish delay before simon begins
      simonPlay(simonMoves, buttonColors, session)
      console.log('Simon\'s turn!')
    }

    function simonPlay(simonMoves, buttonColors, session) {
      let moves = 0, pass = false, n = 1,
      audio = $('#sound')[0]
      // Iterate through simon's moves
      pattern = () => colorSeries(simonMoves, buttonColors)
      setInterval(pattern, 2000)
      pattern()
      // Adding & showing colors
      function colorSeries(simonMoves, buttonColors) {
        // Generate random number for simon to select color
        let rand   = Math.floor((Math.random() * 4) + 0)
        let colors = buttonColors[rand]
        // Add colors to output array
        simonMoves.push(colors)
        // Track move count
        moves++
        if (initial && moves <= 4) {
          // Play sound
          audio.play()
          // Make color lens light up using css class
          $('.' + colors).addClass('glow')
          // Remove light
          setTimeout(() => $('.' + colors).removeClass('glow'), 1000)
          if (moves === 4) {
            // Stop simon's rd 1 sequence
            clearInterval(pattern)
            // Store simon's moves
            console.log('simon\'s current moves: ', simonMoves)
            storeSimonMoves(simonMoves, session)
          }
        } else if (!initial) {
          // Add new color
          if (moves === 1) {
            console.log('simon\'s current moves: ', simonMoves[0])
            return simonArchive.push(simonMoves[0])
          }
          // Bring moves back to 0 & use as index & light up
          let replay = $('.' + simonArchive[moves - 1])
          replay.addClass('glow')
          // Remove light
          setTimeout(() => replay.removeClass('glow'), 1000)
          if (moves === simonArchive.length) {
            // Stop simon's moves
            clearInterval(pattern)
            // Store simon's moves
            storeSimonMoves()
          }
        }
      }
      session++
    }

    function userPlay(simonArchive, session) {
      userMoves = [], pass = false, n = 0,
      audio = $('#click')[0]
      // Hey! it's your move
      $('.status').text('Your move... think carefully')
      // Give user ability to press lens
      $('.lens').on('click', (e) => {
        // Play sound when clicked
        audio.play()
        // Add css class when pressed
        $(e.currentTarget).addClass('glow')
        // Remove after a second
        setTimeout(() => $(e.currentTarget).removeClass('glow'), 1000)
        // Add color selection to input array
        userMoves.push($(e.currentTarget).attr('value'))
        console.log('user\'s current moves: ', userMoves)
        // Check to compare again simon's moves
        compareMoves(userMoves, simonArchive)
        if (initial && userMoves.length === 4) {
          $('.lens').off()
          storeUserMoves(userMoves, session)
        } else if (!initial && userMoves.length === simonArchive.length) {
          $('.lens').off()
          userArchive.push(userMoves[userMoves.length - 1])
          storeUserMoves(userMoves, session)
        }
      })
    }

    function storeSimonMoves(simonMoves, session) {
      // Allow user to play
      pass = true
      // Store simon's moves in archive array
      if (initial) {
        simonArchive += simonMoves
        simonArchive = simonArchive.split(',')
      }
      console.log('simon archive: ', simonArchive)
      // Move to user's turn
      if (pass)
        setTimeout(() => userPlay(simonArchive, session), 2000)
    }

    function storeUserMoves(userMoves, session) {
      // Store user's movies in achive array
      if (initial) {
        userArchive += userMoves
        userArchive = userArchive.split(',')
      }
      // No longer initial round of play
      initial = false
      // Allow simon to play (again)
      pass = true
      // Add new round & move to simon's turn
      if (pass) {
        // Add round end game after rd 10
        round++
        gameState.round = round
        setTimeout(() => goSimon(round), 1000)
      }
      console.log('user archive: ', userArchive)
    }

    function compareMoves(userMoves, simonArchive) {
      let compare = []
      // User move counter, reset after round 1
      n++
      compare = simonArchive.filter((color, index, arr) => {
        return arr[index] === userMoves[index]
      })
      // n will be less than the compare arrray length if input is wrong
      if (n > compare.length)
        stopGame(pattern)
      console.log('user: ', userMoves)
      console.log('simon: ', simonArchive)
    }

    function stopGame(pattern) {
      // Stop the game & reset it
      clearInterval(pattern)
      $('.status').text('Bummer, you got it wrong')
      $('.lens').removeClass('glow')
      $('.lens').off()
      return
    }

    function resetGame(pattern) {
      // Reset all the values and restart game
      initial = true, start = true, pass = false, session = 0,
      n = 0, simonArchive = [], userArchive = [], userMoves = [],
      simonMoves = []
      // Alert user, turn off events & change round
      clearInterval(pattern)
      $('#bg').children().removeClass('glow')
      $('.status').text('Reset! Press start to play again')
      $('#round').text('--')
      return startGame()
    }

    function winGame() {
      // Celebrate!
      console.log('congrats you won!!!!!!')
      return
    }

    startGame(initial, start)

}

$(documentReady)
