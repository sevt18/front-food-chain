import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useApi } from '../../hooks/useApi';
import LoadingSpinner from '../../../components/auth/common/LoadingSpinner';