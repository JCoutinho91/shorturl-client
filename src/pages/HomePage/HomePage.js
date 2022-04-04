import axios from "axios";
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthContext } from "../../context/auth.context";
import "./HomePage.css"

function HomePage() {
  //! Settings of the states to store the data...
  const [fullUrl, setFullUrl] = useState("")
  const [userUrl, setUserUrl] = useState([])
  const [urlData, setUrlData] = useState([])
  //! Loading to avoid undefined's
  const [isLoading, setIsLoading] = useState(true)

  //! Context from payload
  const { isLoggedIn, user } = useContext(AuthContext);

  //! navigate for some redirects
  const navigate = useNavigate();

  const fetchUrlData = async () => {
    //! Getting All the Url Data for the Home Page(For non users)
    try {
      const authToken = localStorage.getItem("authToken");
      const getUrls = await axios.get(
        "http://localhost:5005/api/urlList",
        { headers: { Authorization: `Bearer ${authToken}` } } //! Headers for validation
      );
      const data = getUrls.data
      setUrlData(data)
      setIsLoading(false)
    } catch (error) {
      console.log(error);
    }
  }

  const fetchUserUrl = async () => {
    //! Getting All the Url Data for a specific User
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      const response = await axios.get("http://localhost:5005/api/users/current", {
        headers: { Authorization: `Bearer ${storedToken}` }, //! Headers for validation
      })
      const userUrlData = response.data.urlData;
      setUserUrl(userUrlData)
      setIsLoading(false)

    }
  }

  //! Handling the inserted Url
  const handleUrl = async (e) => {
    e.preventDefault();
    //!If someone is Logged In We Send the User.id to link the url to the user
    if (isLoggedIn) {
      try {
        const requestBody = { fullUrl, userIdentity: user._id };

        const authToken = localStorage.getItem("authToken");
        await axios.post(
          "http://localhost:5005/api/userUrl",
          requestBody,
          { headers: { Authorization: `Bearer ${authToken}` } } //! Headers for validation
        );
        //! Fetch the List to populate the page right away
        fetchUserUrl()
        navigate("/");
      } catch (error) {
        console.log(error);
      }

    } else {
      try {
        //!If someone is NOT logged In. We create a short Url with link to the user.
        const requestBody = { fullUrl };

        const authToken = localStorage.getItem("authToken");
        await axios.post(
          "http://localhost:5005/api/shortUrl",
          requestBody,
          { headers: { Authorization: `Bearer ${authToken}` } } //! Headers for validation
        );
        //! Fetch the List to populate the page right away
        fetchUrlData()
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    }
  };

  //! Fetching the Initial Available Data
  useEffect(() => {
    fetchUrlData()
    fetchUserUrl()
  }, [])



  return (
    <div className="input__url__container">
      <h1 className="title__url">Shortify.</h1>
      <form onSubmit={handleUrl}> {/*Link to HandleSubmit*/}
        <input className="input__url" type="text" name="email" value={fullUrl} onChange={(e) => setFullUrl(e.target.value)} placeholder="Enter Your Url Here (No Http Protocol)" />
        <button className="submit__buton" type="submit">Shorten Your Url Now!</button>
      </form>
      <div className="bottom__container">
        <div className="url_stats">
          {!isLoggedIn && <h2>Last Shortened Urls:</h2>}
          <table>
            <thead>
              <tr>   {/* Check if logged in. If it's not it shows no statitics headers*/}
                <th className="headers__tags">Full Url</th>
                <th className="headers__tags">Short Url</th>
                {isLoggedIn && (<>
                  <th className="headers__tags">Views</th>
                  <th className="headers__tags"> Shorts</th>
                </>
                )}
              </tr>
            </thead>
            <tbody>   {/* Check if logged in. If it's not it shows no statitics data.*/}
              {isLoading ? "Loading..." : (
                isLoggedIn ? (
                  userUrl.map((el, idx) => (
                    <tr key={idx}>
                      <td> <a href={"http://" + el.fullUrl}>{el.fullUrl}</a></td>
                      <td> <a href={"http://localhost:5005/api/" + el.shortUrl}>{el.shortUrl}</a></td>
                      <td>{el.views}</td>
                      <td>{el.shortCount + 1}</td>
                    </tr>
                  ))
                ) : (
                  urlData.map((el, idx) => (
                    <tr key={idx}>
                      <td> <a href={"http://" + el.fullUrl}>{el.fullUrl}</a></td>
                      <td> <a href={"http://localhost:5005/api/" + el.shortUrl}>{el.shortUrl}</a></td>
                    </tr>
                  )))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}


export default HomePage;