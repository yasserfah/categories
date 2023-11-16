import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import {
  randomTraderName,
  randomId,
  randomBoolean,
} from "@mui/x-data-grid-generator";
import { useContext } from "react";
import { CategoryContext } from "../Context";
import { useEffect } from "react";
import axios from "axios"

const initialRows = [
  {
    id: randomId(),
    category: randomTraderName(),
    status: randomBoolean(),
  },
];

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, name: "", isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add Category
      </Button>
    </GridToolbarContainer>
  );
}

export default function AllCategories() {
  const {categories}=useContext(CategoryContext)
  const [rows, setRows] = React.useState([]);
  useEffect(() => {
    setRows(categories)

  },[categories])
  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) =>async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    // await axios.post('http://localhost:5000/categories', rowModesModel);
    console.log(rowModesModel)

  };

  const handleDeleteClick = (id) => async() => {
    await axios.delete(`http://localhost:5000/categories/${id}`);
    setRows(rows.filter((row) => row.id !== id));
    console.log(id)
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row._id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row._id !== id));
    }
  };

  const processRowUpdate =  async (newRow,id) => {
    // console.log('product',newRow)
    

    const updatedRow = { ...newRow };
    if (updatedRow.isNew){
      console.log('new product')
      console.log(updatedRow.categoryName)
      await axios.post('http://localhost:5000/categories',{categoryName:updatedRow.categoryName})

    }
    else{
      console.log(id)
      console.log('old product')
      await axios.put(`http://localhost:5000/categories/${updatedRow.id}`,{categoryName:updatedRow.categoryName})
      
    }
    setRows(rows.map((row) => (row._id === newRow._id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "_id",
      headerName: "Category Id",
      align: "center",
      editable: false,
      headerAlign: "center",
      width: 200,
    },
    {
      field: "categoryName",
      headerName: "Category Name",
      align: "center",
      editable: true,
      width: 200,
      headerAlign: "center",
    },
    
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      align: "center",
      cellClassName: "actions",
      headerAlign: "center",

      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
      className="dashboard-card"
    >
      {
        categories && <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
      }
    </Box>
  );
}
