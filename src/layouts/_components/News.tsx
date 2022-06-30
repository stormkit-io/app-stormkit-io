
import React from "react";
import OutsideClick from "~/components/OutsideClick";
import { Popper } from "@material-ui/core";



const News: React.FC = (): React.ReactElement => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    function handleClick(event: any) {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    }

      const open = Boolean(anchorEl);
      console.log("fucking open", open, anchorEl)
      const id = open ? 'simple-popper' : undefined;

  return (
   <OutsideClick handler={() => setAnchorEl(null)}>

    <div>
      <button aria-describedby={id} className="p-2" onClick={handleClick}>
          <span className="fa-solid fa-bullhorn fa-lg hover:text-white" />
      </button>
      <Popper id={id} open={open} anchorEl={anchorEl}  placement="bottom-end">
        <div className="bg-white" >
        <iframe className="h-96" style={{"width":"38rem"}} src="https://www.stormkit.io/blog/whats-new"/>
        </div>
      </Popper>
    </div>
     </OutsideClick>
  );
};

export default News;
