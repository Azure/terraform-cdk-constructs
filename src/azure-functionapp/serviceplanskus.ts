/**
 * Enum for Azure Service Plan SKUs.
 */
export enum ServicePlanSkus {
  // Consumption Plan
  /**
   * Consumption Plan: Automatically scales based on demand and billed per execution.
   * No dedicated resources; suitable for event-driven and intermittent workloads.
   */
  Consumption = "Y1",

  // Premium Plan (EP = Elastic Premium)
  /**
   * Premium Plan EP1: Offers more CPU and memory than Consumption Plan with features like VNet.
   */
  PremiumEP1 = "EP1",
  /**
   * Premium Plan EP2: Higher CPU and memory, suitable for more demanding workloads.
   */
  PremiumEP2 = "EP2",
  /**
   * Premium Plan EP3: Highest available CPU and memory in the Premium tier.
   */
  PremiumEP3 = "EP3",

  // App Service Plan - Basic
  /**
   * Basic B1: Basic tier, more compute options than Free, suitable for small-scale production.
   */
  ASPBasicB1 = "B1",
  /**
   * Basic B2: Enhanced tier with more CPU and memory.
   */
  ASPBasicB2 = "B2",
  /**
   * Basic B3: Highest Basic tier with more CPU and memory.
   */
  ASPBasicB3 = "B3",

  // App Service Plan - Standard
  /**
   * Standard S1: Suitable for production workloads with auto-scaling and staging slots.
   */
  ASPStandardS1 = "S1",
  /**
   * Standard S2: More CPU and memory than S1, suitable for larger workloads.
   */
  ASPStandardS2 = "S2",
  /**
   * Standard S3: Highest Standard tier, offering maximum available CPU and memory.
   */
  ASPStandardS3 = "S3",

  // App Service Plan - Premium
  /**
   * Premium P1V2: Enhanced performance features and VNet integration.
   */
  ASPPremiumP1V2 = "P1V2",
  /**
   * Premium P2V2: Higher CPU and memory than P1V2.
   */
  ASPPremiumP2V2 = "P2V2",
  /**
   * Premium P3V2: Highest CPU and memory in the Premium category.
   */
  ASPPremiumP3V2 = "P3V2",

  // App Service Plan - Isolated
  /**
   * Isolated I1: Dedicated environment for highest compliance and security.
   */
  ASPIsolatedI1 = "I1",
  /**
   * Isolated I2: Enhanced isolated plan with more resources.
   */
  ASPIsolatedI2 = "I2",
  /**
   * Isolated I3: Top-tier isolated plan with maximum resources.
   */
  ASPIsolatedI3 = "I3",
}
