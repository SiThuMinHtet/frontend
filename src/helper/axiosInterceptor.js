import axios from "axios";
import {jwtDecode} from "jwt-decode";

function isTokenExpired(token) {
    if(!token){
        return true;
    }

    try{
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        const currentToken = Date.now()/1000;   
        console.log(currentToken);
        return decodedToken.exp < currentToken;
    } catch (error){
        console.error("Invalid token:",error);
        return true;
    }
}

const useAxiosInterceptor = () => {
    const apiClient = axios.create();

    axios.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("accessToken");
            if(token){
                config.headers["Authorization"] = `Bearer ${token}`;
            }
            return config;
        },
        (error)=> {
            return Promise.reject(error);
        }
    );

    axios.interceptors.response.use(
        async (config) => {
            const token = localStorage.getItem("accessToken");
            if(token != null){
                if(isTokenExpired(token)){ // to do if token is expired
                    console.log("Access token expired");

                    const decodedToken = jwtDecode(token);
                    const userId = decodedToken.id;

                    const response = await apiClient.get(
                        `http://localhost:8080/users/getbyId/${userId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            },
                        }
                    );

                    console.log(response);

                    const { accesstoken } = response.data;
                    console.log("Access token: "+ accesstoken);
                    localStorage.setItem("accessToken", accesstoken); // add new token
                    config.headers["Authorization"] = `Bearer ${accesstoken}`;
                } else {
                    console.log("Access token is valid");
                    config.headers["Authorization"] = `Bearer ${token}`;
                }
            }
            return config;
        },
        (error) => {
            if (error.response && error.response.status === 403){
                console.log("Access token expired");
                // localStorage.removeItem("accessToken");
                window.location.href = "/auth/login";
            }
            return Promise.reject(error);
        }
    );
}

export default useAxiosInterceptor;