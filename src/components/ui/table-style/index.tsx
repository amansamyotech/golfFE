import { styled } from "@mui/material/styles";
import Palette from "./theam-pattle";

const TableStyle = styled("div")({
  width: "100%",
  minWidth: 0,
  "& .MuiPaper-root": {
    width: "100%",
    height: 560,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  "& .MuiDataGrid-root": {
    border: "none",
    width: "100% !important",
    height: "100% !important",
  },
  "& .MuiDataGrid-main": {
    overflow: "hidden",
  },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: Palette.grey[200],
    borderBottom: "1px solid #eee",
    outline: "none !important",
    borderRadius: 0,
  },
  "& .MuiDataGrid-cell": {
    borderBottom: "none",
    outline: "none !important",
  },
  "& .MuiDataGrid-row": {
    borderBottom: "1px solid #eee",
  },
  "& .MuiDataGrid-footerContainer": {
    minHeight: 56,
    borderTop: "1px solid #eee",
  },
  "& .name-column--cell": {
    color: Palette.primary.main,
    cursor: "pointer",
  },
  "& .name-column--cell--capitalize": {
    textTransform: "capitalize",
  },
  "& .name-column--cell:hover": {
    textDecoration: "underline",
  },
  "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
    textTransform: "capitalize",
    fontSize: "15px",
  },
  ".MuiDataGrid-cell:focus,.MuiDataGrid-columnHeader:focus,.MuiDataGrid-columnHeaderCheckbox:focus": {
    outline: "none !important",
  },
});

export default TableStyle;
