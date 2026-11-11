import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import socket from '../services/socket';
import { getNetworkStatus, triggerFailover, getAlerts } from '../services/api';

const NetworkContext = createContext(null);

export function NetworkProvider({ children }) {
  const [networkStatus, setNetworkStatus] = useState({
    primaryLinkStatus: 'Active',
    backupLinkStatus: 'Standby',
    activePath: 'Primary Path (Fiber Backbone - OSPF Cost 10)',
    latencyMs: 2.3,
    packetLossPct: 0.0,
    bandwidthMbps: 940.0,
    jitterMs: 0.3,
    networkHealthPct: 98.6,
    totalDevices: 12,
    connectedDevices: 12,
    isSimulated: true,
    telemetrySource: 'Development Simulation Engine'
  });

  const [telemetryHistory, setTelemetryHistory] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [systemNotifications, setSystemNotifications] = useState([]);
  const [isConnectedToSocket, setIsConnectedToSocket] = useState(false);
  const [isFailoverLoading, setIsFailoverLoading] = useState(false);
  const [syncTick, setSyncTick] = useState(0);

  // Fetch initial network status and alerts
  const fetchInitialData = useCallback(async () => {
    try {
      const [netRes, alertRes] = await Promise.all([
        getNetworkStatus().catch(e => ({ data: null })),
        getAlerts().catch(e => ({ data: null }))
      ]);

      if (netRes?.data?.success) {
        setNetworkStatus(prev => ({ ...prev, ...netRes.data.data }));
        if (netRes.data.data.history) {
          setTelemetryHistory(netRes.data.data.history);
        }
      }

      if (alertRes?.data?.success) {
        setActiveAlerts(alertRes.data.data.filter(a => a.active === 1 || a.active === true));
      }

      setSyncTick(t => t + 1);
    } catch (err) {
      console.warn('[NetworkContext] Sync update notice:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();

    // Auto-sync polling every 3.5 seconds across all connected laptops
    const pollInterval = setInterval(() => {
      fetchInitialData();
    }, 3500);

    // Socket listeners
    socket.on('connect', () => {
      setIsConnectedToSocket(true);
    });

    socket.on('disconnect', () => {
      setIsConnectedToSocket(false);
    });

    socket.on('initial_state', (payload) => {
      if (payload.networkState) {
        setNetworkStatus(prev => ({ ...prev, ...payload.networkState }));
      }
    });

    socket.on('telemetry_tick', (payload) => {
      if (payload.state) {
        setNetworkStatus(prev => ({ ...prev, ...payload.state }));
      }
      if (payload.point) {
        setTelemetryHistory(prev => {
          const next = [...prev, payload.point];
          return next.length > 40 ? next.slice(next.length - 40) : next;
        });
      }
    });

    socket.on('network_failover_event', (payload) => {
      if (payload.state) {
        setNetworkStatus(prev => ({ ...prev, ...payload.state }));
      }
      if (payload.alert) {
        addNotification(payload.alert);
      }
    });

    socket.on('alert_broadcast', (alert) => {
      setActiveAlerts(prev => [alert, ...prev]);
      addNotification({
        title: `BROADCAST: ${alert.title}`,
        severity: alert.severity,
        message: alert.description,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('alert_dismissed', ({ id }) => {
      setActiveAlerts(prev => prev.filter(a => a.id !== Number(id)));
    });

    return () => {
      clearInterval(pollInterval);
      socket.off('connect');
      socket.off('disconnect');
      socket.off('initial_state');
      socket.off('telemetry_tick');
      socket.off('network_failover_event');
      socket.off('alert_broadcast');
      socket.off('alert_dismissed');
    };
  }, [fetchInitialData]);

  const addNotification = (notif) => {
    const id = Date.now() + Math.random();
    setSystemNotifications(prev => [{ id, ...notif }, ...prev.slice(0, 10)]);
  };

  const dismissNotification = (id) => {
    setSystemNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleFailoverToggle = async (action) => {
    setIsFailoverLoading(true);
    try {
      const res = await triggerFailover(action);
      if (res.data?.success && res.data?.state) {
        setNetworkStatus(prev => ({ ...prev, ...res.data.state }));
      }
    } catch (err) {
      console.error('[NetworkContext] Failover trigger error:', err);
    } finally {
      setIsFailoverLoading(false);
    }
  };

  return (
    <NetworkContext.Provider
      value={{
        networkStatus,
        telemetryHistory,
        activeAlerts,
        setActiveAlerts,
        systemNotifications,
        dismissNotification,
        isConnectedToSocket,
        isFailoverLoading,
        handleFailoverToggle,
        syncTick,
        refreshData: fetchInitialData
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
}
