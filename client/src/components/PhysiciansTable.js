import React, { useState, useEffect } from 'react';
import { 
  DataGrid, 
  GridActionsCellItem,
  GridToolbar 
} from '@mui/x-data-grid';
import { 
  Delete as DeleteIcon, 
  Edit as EditIcon,
  Add as AddIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography
} from '@mui/material';
import { 
  fetchPhysicians,
  createPhysician,
  updatePhysician,
  deletePhysician 
} from '../services/api';

export default function PhysiciansTable() {
  const [physicians, setPhysicians] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [currentPhysician, setCurrentPhysician] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [physicianToDelete, setPhysicianToDelete] = useState(null);

  useEffect(() => {
    loadPhysicians();
  }, []);

  const loadPhysicians = async () => {
    const data = await fetchPhysicians();
    setPhysicians(data);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const physicianData = {
      name: formData.get('name'),
      specialty: formData.get('specialty')
    };

    if (currentPhysician) {
      await updatePhysician(currentPhysician.id, physicianData);
    } else {
      await createPhysician(physicianData);
    }

    loadPhysicians();
    setOpenForm(false);
  };

  const handleDelete = async () => {
    await deletePhysician(physicianToDelete);
    loadPhysicians();
    setDeleteConfirmOpen(false);
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'specialty', headerName: 'Specialty', flex: 1 },
    {
      field: 'actions',
      type: 'actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<ViewIcon />}
          label="View"
          onClick={() => {
            setCurrentPhysician(params.row);
            setOpenForm(true);
          }}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => {
            setCurrentPhysician(params.row);
            setOpenForm(true);
          }}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => {
            setPhysicianToDelete(params.id);
            setDeleteConfirmOpen(true);
          }}
          showInMenu
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Physicians</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setCurrentPhysician(null);
            setOpenForm(true);
          }}
        >
          Add Physician
        </Button>
      </Box>

      <DataGrid
        rows={physicians}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        pageSizeOptions={[5, 10, 25]}
      />

      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>
          {currentPhysician ? 'Edit Physician' : 'Add New Physician'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              defaultValue={currentPhysician?.name || ''}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="specialty"
              label="Specialty"
              id="specialty"
              defaultValue={currentPhysician?.specialty || ''}
            />
            <DialogActions>
              <Button onClick={() => setOpenForm(false)}>Cancel</Button>
              <Button type="submit" variant="contained">
                {currentPhysician ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this physician?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
