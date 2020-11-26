import { ShoppingCart } from "@material-ui/icons";

import "./shell.css";

export function Header(props) {
  return (
    <div className={props.headerClass}>
      <div className={props.headerLeft}>
        <img src="medicine-delivery.webp" height="30px" width="30px" />
        <span>&nbsp;&nbsp;</span>
        <h3 className={props.textClass}>{"Medicine on wheels"}</h3>
      </div>

      <div className={props.headerRight}>
        <ShoppingCart fontSize={'large'} />
        <div className="Counter">
          <span className="CounterText">5</span>
        </div>
      </div>
    </div>
  );
}
