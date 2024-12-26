const scrapeTweets = async function () {
    const baseUrl = "https://twitter.com";

    //open twitter.com
    await createTab(baseUrl, function (body, tab) { });
    await asyncWait(4000);

    //hold the contents of each tweet as a article tag
    let tweets = [];
    var finalValue = `Tweet Text\tUsername\tLikes\tComments\tRetweets\tTimeStamp\n`;

    //interate until desired amount of tweets have been extracted
    while (1) {

        //capture current html body in view
        const body = await tabBody();
        console.log(body);

        // extract each tweet as a articale tag from the current body via the data-testid=tweet atribute
        const newTweetElements = $(body).find('[data-testid="tweet"]');
        tweets = tweets.concat(Array.from(newTweetElements));//for some reason when I dont make it an array it wont print

        //stop scraping after 20 tweets
        if (tweets.length > 20) {
            break;
        }//else

        //scroll down page for more tweets if limit not reached
        await chrome.tabs.executeScript({ code: 'window.scrollTo(0, document.body.scrollHeight - window.innerHeight);' });
        await asyncWait(4000);//delay

    }

    const formattedTweets = tweets.map((tweet, index) => {

        //Likes
        const likeElement = $(tweet).find('[data-testid="like"]');
        const likeCount = likeElement.attr('aria-label').replace(/[^0-9]/g, '');

        //username
        const usernameElement = $(tweet).find('[data-testid="User-Name"] > div:nth-of-type(2) > div > div > a > div');
        const username = usernameElement.text();

        //time stmap
        const timestampElement = $(tweet).find('time');
        const timestamp = timestampElement.attr('datetime');

        //comments
        const commentElement = $(tweet).find('[data-testid="reply"]');
        const commentCount = commentElement.attr('aria-label').replace(/[^0-9]/g, '');

        //retweets
        const retweetElement = $(tweet).find('[data-testid="retweet"]');
        const retweetCount = retweetElement.attr('aria-label').replace(/[^0-9]/g, '');

        //content
        const contentElement = $(tweet).find('[data-testid="tweetText"]');
        const tweetText = contentElement.text().trim()

        return {
            tweet: tweet,
            likes: parseInt(likeCount),
            username: username,
            timestamp: timestamp,
            comments: parseInt(commentCount),
            retweets: parseInt(retweetCount),
            text: tweetText
        };
    });

    onst scrapeTwitter = async function () {

    var searchTerm = $("#searchTerm").val();

    //append search term ot url
    const baseUrl = `https://twitter.com/search?q=${encodeURIComponent(searchTerm)}&f=user`;

    //open url
    await createTab(baseUrl, function (body, tab) { });
    await asyncWait(4000);

    let tweets = [];
    var people = 'Username\n';


    //interate until desired amount of tweets have been extracted
    while (1) {

        //capture current html body in view
        const body = await tabBody();
        console.log(body);

        // asyncWait(4000);//delay

        // extract each tweet as a articale tag from the current body via the data-testid=tweet atribute
        const newTweetElements = $(body).find('[data-testid="UserCell"]');
        tweets = tweets.concat(Array.from(newTweetElements));//for some reason when I dont make it an array it wont print

        //stop scraping after 20 tweets
        if (tweets.length > 100) {
            console.log(newTweetElements);
            break;

        }//else

        //scroll down page for more tweets if limit not reached
        await chrome.tabs.executeScript({ code: 'window.scrollTo(0, document.body.scrollHeight - window.innerHeight);' });
        await asyncWait(6000);//delay

    }

    const formattedTweets = tweets.map((tweet, index) => {

        const usernameElement = $(tweet).find('a');
        const username = usernameElement.attr('href').replace(/[^a-zA-Z]/g, '');

        return {

            username: username,

        };
    });

    // Log the formatted array to console
    //console.log(formattedTweets);
    formattedTweets.forEach(tweet => console.log(tweet));


    for (let i = 0; i < formattedTweets.length; i++) {
        people += `${formattedTweets[i].username}\n`
    }

    $("#results").val(people);

    pasteInSheetTab($("#results"), $("#results-sheet").val());

    return formattedTweets;

}