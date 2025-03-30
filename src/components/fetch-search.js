export async function fetchSearch(value) {
    const searchUrl = `https://imdb236.p.rapidapi.com/imdb/search?originalTitle=${value}&rows=8`;
    const Key = "07807008b3msh7188004c6c5cd67p18ca7bjsnbc847e4ae696";
    try {
        const response = await fetch(searchUrl, {
            method: "get",
            headers:{
                "x-rapidapi-host": "imdb236.p.rapidapi.com",
                "x-rapidapi-key": Key,
            },
        });
        if (!response.ok){
            throw new Error("Shitt! response not ok!");
        }
        const data = await response.json();
        // console.log("search data",  data);
        return data;
    } catch (error){
        console.log("error in fetch-search:", error);
        return[];
    }
}
