# Azure Application Gateway Construct

This class represents an Azure Application Gateway resource. It provides a convenient way to manage Azure Application Gateway resources.

## What is Azure Application Gateway?

Azure Application Gateway is a web traffic load balancer that enables you to manage traffic to your web applications. It offers various features like URL-based routing, session affinity, secure sockets layer (SSL) termination, Web Application Firewall (WAF), and more. This makes it an ideal choice for optimizing web app performance and reliability.

For more information, refer to the [official Azure documentation on Application Gateway](https://docs.microsoft.com/en-us/azure/application-gateway/).

## Application Gateway Best Practices

- Use separate instances for production and non-production environments.
- Implement WAF to protect your web applications from common web vulnerabilities.
- Use URL-based routing for better control of the traffic distribution.
- Enable diagnostics and logging for better monitoring and troubleshooting.

## Application Gateway Class Properties

This class encapsulates several properties to configure and manage the Application Gateway:

- `name`: The name of the Application Gateway resource.
- `location`: The Azure region where the Application Gateway will be deployed.
- `resourceGroup`: The Azure Resource Group to which the Application Gateway belongs.
- `skuTier`: The pricing tier (e.g., Standard, WAF).
- `skuSize`: The size of the Application Gateway instance.
- `capacity`: The number of instances for the Application Gateway.
- `backendAddressPools`: Backend address pools for routing traffic.
- `backendHttpSettings`: HTTP settings for the backend address pool.
- `httpListeners`: HTTP listeners for processing incoming traffic.
- `requestRoutingRules`: Routing rules for directing traffic.
- `frontendPorts`: Frontend ports configuration.
- `subnet`: Subnet details for the Application Gateway.
- `tags`: Tags for identifying and categorizing the Application Gateway.
- Additional properties for advanced configurations (SSL certificates, WAF configuration, etc.).

## Deploying the Application Gateway

Here's an example of how to deploy an Application Gateway resource using this class:

```typescript
const appGateway = new Gateway(this, 'myAppGateway', {
  name: 'myAppGateway',
  location: 'East US',
  resourceGroup: myResourceGroup,
  skuTier: 'Standard_v2',
  skuSize: 'Standard_Small',
  capacity: 2,
  backendAddressPools: [...],
  backendHttpSettings: [...],
  httpListeners: [...],
  requestRoutingRules: [...],
  frontendPorts: [...],
  // Additional configurations
  tags: {
    'env': 'production',
  },
});

This code will create a new Application Gateway named myAppGateway in the East US Azure region within the specified resource group. It will be configured with the Standard v2 pricing tier, small SKU size, and essential settings for backend pools, HTTP settings, listeners, and routing rules. Tags are used for easy identification.