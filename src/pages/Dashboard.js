import React from "react";
import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import { School, ListAlt, Assignment, Assessment } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { hodAPI } from "../services/api";

const Dashboard = () => {
  const { user } = useAuth();

  const [statsData, setStatsData] = useState({
    totalCourses: 0,
    activeCLOs: 0,
    programOutcomes: 0,
    pendingReviews: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await hodAPI.getDashboardStats();
      setStatsData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const stats = [
    {
      title: "Total Courses",
      value: statsData.totalCourses,
      icon: <School />,
      color: "#1976d2",
    },
    {
      title: "Active CLOs",
      value: statsData.activeCLOs,
      icon: <ListAlt />,
      color: "#2e7d32",
    },
    {
      title: "Program Outcomes",
      value: statsData.programOutcomes,
      icon: <Assignment />,
      color: "#ed6c02",
    },
    {
      title: "Pending Reviews",
      value: statsData.pendingReviews,
      icon: <Assessment />,
      color: "#d32f2f",
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user?.name}!
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        {user?.role} Dashboard - {user?.department?.name}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • New course "Advanced Algorithms" added
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • CLO mappings updated for "Database Systems"
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • Attainment report generated for Semester 1
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • Manage courses and CLOs
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • Review attainment reports
            </Typography>
            <Typography variant="body2" color="textSecondary">
              • Generate analytics reports
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
