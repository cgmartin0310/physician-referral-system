import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TableSortLabel,
  TablePagination,
  TextField,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  FilterList as FilterListIcon,
  Refresh as RefreshIcon 
} from '@mui/icons-material';

const ReferralsTable = ({ referrals = [], onRefresh }) => {
  // State management
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('date');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState('');

  // Process data
  const filteredData = useMemo(() => {
    return referrals.filter(referral => 
      Object.values(referral).some(
        val => val.toString().toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [referrals, filter]);

  const sortedData = useMemo(() => {
    return filteredData.sort((a, b) => {
      if (order === 'asc') {
        return a[orderBy] > b[orderBy] ? 1 : -1;
      } else {
        return a[orderBy] < b[orderBy] ? 1 : -1;
      }
    });
  }, [filteredData, order, orderBy]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [sortedData, page, rowsPerPage]);

  // Handlers
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPage(0);
  };

  const handleRefresh = () => {
    onRefresh && onRefresh();
  };

  // Table columns configuration
  const columns = [
    { id: 'patientName', label: 'Patient Name', minWidth: 150 },
    { id: 'physician', label: 'Referring Physician', minWidth: 150 },
    { id: 'date', label: 'Referral Date', minWidth: 120 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'priority', label: 'Priority', minWidth: 100 }
  ];

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Patient Referrals</Typography>
        <Box>
          <TextField
            size="small"
            label="Filter records"
            variant="outlined"
            value={filter}
            onChange={handleFilterChange}
            sx={{ mr: 2, width: 250 }}
          />
          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filter columns">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="referrals table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sortDirection={orderBy === column.id ? order : false}
                  sx={{ minWidth: column.minWidth }}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={() => handleSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((referral) => (
                <TableRow 
                  key={referral.id}
                  hover
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    bgcolor: referral.status === 'Urgent' ? 'rgba(255, 0, 0, 0.1)' : 'inherit'
                  }}
                >
                  {columns.map((column) => (
                    <TableCell key={`${referral.id}-${column.id}`}>
                      {referral[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No referrals found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </Paper>
  );
};

ReferralsTable.propTypes = {
  referrals: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      patientName: PropTypes.string.isRequired,
      physician: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['Pending', 'Completed', 'Rejected', 'Urgent']),
      priority: PropTypes.oneOf(['Low', 'Medium', 'High'])
    })
  ),
  onRefresh: PropTypes.func
};

export default ReferralsTable;
