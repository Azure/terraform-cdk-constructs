/**
 * Azure Network Watcher module
 *
 * This module provides constructs for creating and managing Azure Network Watchers.
 *
 * Network Watcher is a regional service that provides network monitoring and diagnostic
 * tools in Azure. It enables you to monitor and diagnose conditions at a network scenario
 * level in, to, and from Azure.
 *
 * IMPORTANT: Azure only allows one Network Watcher per subscription per region.
 * If you need Network Watcher functionality in multiple regions, you must create
 * a separate Network Watcher for each region.
 */

export * from "./lib";
