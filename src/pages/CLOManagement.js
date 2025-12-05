// frontend/src/pages/CLOManagement.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  Chip,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { cloAPI, courseAPI } from '../services/api';

const CLOManagement = () => {
  const [clos, setClos] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCLO, setEditingCLO] = useState(null);
  const [formData, setFormData] = useState({
    cloCode: '',
    description: '',
    bloomLevel: '',
    version: '1.0',
    courseId: ''
  });

  const bloomLevels = [
    'REMEMBER',
    'UNDERSTAND',
    'APPLY',
    'ANALYZE',
    'EVALUATE',
    'CREATE'
  ];

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadCLOs(selectedCourse);
    }
  }, [selectedCourse]);

  const loadCourses = async () => {
    try {
      const response = await courseAPI.getCourses();
      setCourses(response.data);
      if (response.data.length > 0) {
        setSelectedCourse(response.data[0].id);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const loadCLOs = async (courseId) => {
    try {
      const response = await cloAPI.getCLOsByCourse(courseId);
      setClos(response.data);
    } catch (error) {
      console.error('Error loading CLOs:', error);
    }
  };

  const handleOpenDialog = (clo = null) => {
    if (clo) {
      setEditingCLO(clo);
      setFormData({
        cloCode: clo.cloCode,
        description: clo.description,
        bloomLevel: clo.bloomLevel,
        version: clo.version,
        courseId: clo.courseId
      });
    } else {
      setEditingCLO(null);
      setFormData({
        cloCode: '',
        description: '',
        bloomLevel: '',
        version: '1.0',
        courseId: selectedCourse
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCLO(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCLO) {
        await cloAPI.updateCLO(editingCLO.id, formData);
      } else {
        await cloAPI.createCLO(formData);
      }
      handleCloseDialog();
      loadCLOs(selectedCourse);
    } catch (error) {
      console.error('Error saving CLO:', error);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          CLO Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          disabled={!selectedCourse}
        >
          Add CLO
        </Button>
      </Box>

      <Box mb={3}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select Course</InputLabel>
          <Select
            value={selectedCourse}
            label="Select Course"
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.code} - {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>CLO Code</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Bloom's Level</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clos.map((clo) => (
              <TableRow key={clo.id}>
                <TableCell>{clo.cloCode}</TableCell>
                <TableCell>{clo.description}</TableCell>
                <TableCell>
                  <Chip
                    label={clo.bloomLevel}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>{clo.version}</TableCell>
                <TableCell>
                  <Chip
                    label={clo.isActive ? 'Active' : 'Inactive'}
                    color={clo.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(clo)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCLO ? 'Edit CLO' : 'Add New CLO'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="CLO Code"
                  value={formData.cloCode}
                  onChange={(e) => setFormData({ ...formData, cloCode: e.target.value })}
                  placeholder="CLO1, CLO2, etc."
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Bloom's Taxonomy Level</InputLabel>
                  <Select
                    value={formData.bloomLevel}
                    label="Bloom's Taxonomy Level"
                    onChange={(e) => setFormData({ ...formData, bloomLevel: e.target.value })}
                  >
                    {bloomLevels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="Version"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingCLO ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default CLOManagement;