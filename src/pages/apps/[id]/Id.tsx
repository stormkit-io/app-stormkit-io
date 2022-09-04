import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Id: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // For now Navigate to the environments page.
  // In the future we can create a dashboard here.
  useEffect(() => {
    navigate(`/apps/${id}/environments`);
  }, []);

  return null;
};

export default Id;
