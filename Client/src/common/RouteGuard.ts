import { useEffect } from "react";

const RouteGuard=()=>{
  
          window.history.pushState(
            { name: "browserBack" },
            "on browser back click",
            window.location.href
          );
          // window.history.pushState(
          //   { name: "browserBack" },
          //   "on browser back click",
          //   window.location.href
          // );
          window.addEventListener(
            "popstate",
            (event) => {
              if (event.state) {
                alert('Your information may lost');
                return true;
              }
            },
            false
          );
   
    
}
export default RouteGuard;