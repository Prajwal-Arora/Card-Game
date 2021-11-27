import { useEffect } from "react";

const RouteGuard=(message:string)=>{
  
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
                alert(message);
                return true;
              }
            },
            false
          );
   
    
}
export default RouteGuard;