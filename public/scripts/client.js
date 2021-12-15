/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


$(document).ready(function() { // to make the function available after the document is loaded// we can simply wrap our jQuery in this function OR transfer our script tag to the end of our hyml doc

const escape =  function(str) {
  let div = document.createElement('div'); // create an html element (div)

  div.appendChild(document.createTextNode(str)); 
  return div.innerHTML;
};



/*creating a new tweet*/
const createTweetElement = function(tweetsArr) {
  const $tweet = $("<article>").addClass("tweet");
  const daysAgo = daysSinceTweet(tweetsArr["created_at"]);

  const innerHTML = `
        <header>
            <img src= ${tweetsArr.user.avatars}>
            <span>${tweetsArr.user.name}</span>
            <span class="handle">${tweetsArr.user.handle}</span>
        </header>
        <span>${escape(tweetsArr.content.text)}</span>
        <footer>
          <span>${daysAgo} days ago</span>
          <span class="interactOptions"><i class="fas fa-flag"></i><i class="fas fa-retweet"></i><i class="fas fa-heart"></i></span>
        </footer>
        `;

  $tweet.append(innerHTML);
  return $tweet;
};

/*displaying the time passed since a tweet*/
const daysSinceTweet = function(epochOfTweet) {
  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const millisecondsInDay = 86400000;

  const timeDifference = currentTime - epochOfTweet;
  const dayDifference = timeDifference / millisecondsInDay;

  return Math.floor(dayDifference);
};

//looping through te array of tweets and appending the new tweet in the top of the list
const renderTweets = function(tweetsArr) {
  for (const tweet of tweetsArr) {
    const $tweet = createTweetElement(tweet);
    $('section.allTheTweets').prepend($tweet);
  }
};

//Gets the tweets from allTweets section
const loadTweets = function() {
  $.ajax('/tweets/', { method: 'GET' })
    .then(function(allTweets) {
      renderTweets(allTweets);
    });
};

loadTweets();



//adding a listnerEvent on submit using jQuery
$('#new-post-tweet').submit(function(event) {
  event.preventDefault(); // prevents the page from reloading (the default behaviour)
  $('.new-tweet .error').empty().slideUp(); //slides up if you try to submit an empty tweet
  const $form = $(this);
  const newTweetTextStr = $form.children('textarea').val();

  //displays an error msg if the tweet is empty
  if (!newTweetTextStr) {
    $('.new-tweet .error').append('Your tweet must contain at least one character <i class="fas fa-exclamation-triangle"></i>');
    setTimeout(() => {
      $('.new-tweet .error').slideDown();
    }, 600);
  } 

  //displays an error msg if the tweet is too long
  else if (newTweetTextStr.length > 140) {
    $('.new-tweet .error').append('Your tweet is exceeding the limit number of characters allowed <i class="fas fa-exclamation-triangle"></i>');
    setTimeout(() => {
      $('.new-tweet .error').slideDown();
    }, 600);
  } 
  else {

    //if valid tweet, post the new tweet using ajax
    const tweet = $form.serialize();
    $.ajax({ url: "/tweets/", method: 'POST', data: tweet })
    .then (function(successfulPost) {
      return $.ajax('/tweets/', { method: 'GET' })
    })
    .then (function(allTweetsArr) {
      $form[0].reset();
      $form.children('span').text(140);
      const latestTweet = [allTweetsArr[allTweetsArr.length - 1]];
      renderTweets(latestTweet);
    })
    .fail(function(err) {
      alert(err.responseJSON.error);
    })
  }
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////

//display error msgs if the tweet is empty or too long

// var form = $('.new-tweet form');

// 	// gets the tweets from path /tweets
// 	form.on('submit', function(event) {
// 		// prevent redirect:
// 		event.preventDefault();

// 		// remove leading and trailing whitespace:
// 		//let potentialTweet = $('.new-tweet form textarea').val().replace(/^\s+|\s+$/g, '');

//     let enteredTweet = $('.new-tweet form textarea').val().replace(/^\s+|\s+$/g, '');

// 		// check for long and empty tweets:
// 		if (enteredTweet.length > 140) {
//       $('.new-tweet textarea').empty().slideUp();
// 			$('.new-tweet').prepend(`<span class="error" style= "color:red; padding:20px; font-weight:bold;">You exceeded the limit of the tweet's characters.</span>`);
//       setTimeout(() => {
//         $('.new-tweet textarea').slideDown();
//       }, 600);
// 		} else if (enteredTweet === '') {
//       $('.new-tweet textarea').empty().slideUp();
//       $('.new-tweet').prepend(`<span class="error" style= "color:red; padding:20px; font-weight:bold;">Your tweet should contain at least one character.</span>`);
//       setTimeout(() => {
//               $('.new-tweet textarea').slideDown();
//             }, 600);

// 		} 

  //   else {
	// 		// if valid, POST:
	// 		$.ajax({
	// 			type: 'POST',
	// 			url: form.attr('action'),
	// 			data: form.serialize(), //turns a set of form data into a query string
	// 			success: function() {
	// 				$('.new-tweet textarea').val('');
	// 				loadTweets();
	// 			}
	// 		});
  //     $('.new-tweet textarea').empty().slideUp();
  //     setTimeout(() => {
  //       $('.new-tweet textarea').slideDown();
  //     }, 600);

	// 	}

	// });
//////////////////////////////////////////////////////////////////////////////////////////////////////



/*compose button in header: shows/hide the compose tweet section*/
$('#compose-new button').click(function() {
  $('section.new-tweet').slideToggle("slow");
  $('section.new-tweet textarea').focus();
});

});

