findTrailer("sonic 3");
//-----------funtions-----------
function findTrailer(movieTitle) {
    document.addEventListener("DOMContentLoaded", async () => {
        //-----movie title for the trailer search--------
        const query = encodeURIComponent(movieTitle + " official trailer");
        const apiKey = "AIzaSyDpo2qTuH8NmTPv-mIdPxy26WjAHNjruG4";
        const apiURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=1&key=${apiKey}`;
        try {
            const response = await fetch(apiURL);
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                const videoId = data.items[0].id.videoId;
                document.getElementById("trailerFrame").src =
                    "https://www.youtube.com/embed/" + videoId;
            } else {
                console.error("No trailer found.");
            }
        } catch (error) {
            console.error("Error fetching trailer:", error);
        }
    });
};