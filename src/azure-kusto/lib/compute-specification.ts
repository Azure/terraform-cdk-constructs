export interface IComputeSpecification {
  skuName: string;
  workload: string;
  series: string;
  size: string;
  vCPU: number;
  memory: number;
  cache: number;
  availibleZones: string[];
}

export class ComputeSpecification {
  static devtestExtraSmallDv2: IComputeSpecification = {
    skuName: "Dev(No SLA)_Standard_D11_v2",
    workload: "dev/test",
    series: "Dv2/DSv2 Series",
    size: "Extra Small",
    vCPU: 2,
    memory: 14,
    cache: 78,
    availibleZones: ["1", "2", "3"],
  };

  static devtestExtraSmallEav4: IComputeSpecification = {
    skuName: "Dev(No SLA)_Standard_E2a_v4",
    workload: "dev/test",
    series: "Ev4/Edv4 Series",
    size: "Extra Small",
    vCPU: 2,
    memory: 16,
    cache: 24,
    availibleZones: ["1", "2", "3"],
  };

  static ComputeOptimizedLargeD14v2: IComputeSpecification = {
    skuName: "Standard_D14_v2",
    workload: "Compute optimized",
    series: "Dv2/DSv2 Series",
    size: "Large",
    vCPU: 16,
    memory: 112,
    cache: 680,
    availibleZones: ["1", "2", "3"],
  };

  static ComputeOptimizedExtraSmallD11v2: IComputeSpecification = {
    skuName: "Standard_D11_v2",
    workload: "Compute optimized",
    series: "Dv2/DSv2 Series",
    size: "Extra Small",
    vCPU: 2,
    memory: 14,
    cache: 78,
    availibleZones: ["1", "2", "3"],
  };

  static ComputeOptimizedLargeD16dv5: IComputeSpecification = {
    skuName: "Standard_D16d_v5",
    workload: "Compute optimized",
    series: "Ddv5 Series",
    size: "Large",
    vCPU: 16,
    memory: 64,
    cache: 485,
    availibleZones: [],
  };

  static ComputeOptimizedMediumD13v2: IComputeSpecification = {
    skuName: "Standard_D13_v2",
    workload: "Compute optimized",
    series: "Dv2/DSv2 Series",
    size: "Medium",
    vCPU: 8,
    memory: 56,
    cache: 335,
    availibleZones: ["1", "2", "3"],
  };

  static ComputeOptimizedSmallD12v2: IComputeSpecification = {
    skuName: "Standard_D12_v2",
    workload: "Compute optimized",
    series: "Dv2/DSv2 Series",
    size: "Small",
    vCPU: 4,
    memory: 28,
    cache: 162,
    availibleZones: ["1", "2", "3"],
  };

  static StorageOptimizedLargeStandardDS14v24TBPS: IComputeSpecification = {
    skuName: "Standard_DS14_v2+4TB_PS",
    workload: "Storage optimized",
    series: "Dv2/DSv2 Series",
    size: "Large",
    vCPU: 16,
    memory: 112,
    cache: 4096,
    availibleZones: ["1", "2", "3"],
  };

  static StorageOptimizedStandardDS14v23TBPS: IComputeSpecification = {
    skuName: "Standard_DS14_v2+3TB_PS",
    workload: "Storage optimized",
    series: "Dv2/DSv2 Series",
    size: "Large",
    vCPU: 16,
    memory: 112,
    cache: 3072,
    availibleZones: ["1", "2", "3"],
  };

  static StorageOptimizedMediumStandardDS13v21TBPS: IComputeSpecification = {
    skuName: "Standard_DS13_v2+1TB_PS",
    workload: "Storage optimized",
    series: "Dv2/DSv2 Series",
    size: "Medium",
    vCPU: 8,
    memory: 56,
    cache: 1024,
    availibleZones: ["1", "2", "3"],
  };

  static StorageOptimizedMediumStandardDS13v22TBPS: IComputeSpecification = {
    skuName: "Standard_DS13_v2+2TB_PS",
    workload: "Storage optimized",
    series: "Dv2/DSv2 Series",
    size: "Medium",
    vCPU: 8,
    memory: 56,
    cache: 2048,
    availibleZones: ["1", "2", "3"],
  };

  static ComputeOptimizedExtraLargeStandardD32dv5: IComputeSpecification = {
    skuName: "Standard_D32d_v5",
    workload: "Compute optimized",
    series: "Ddv5 Series",
    size: "Extra Large",
    vCPU: 32,
    memory: 128,
    cache: 976,
    availibleZones: [],
  };

  static ComputeOptimizedExtraLargeStandardD32dv4: IComputeSpecification = {
    skuName: "Standard_D32d_v4",
    workload: "Compute optimized",
    series: "Ddv4 Series",
    size: "Extra Large",
    vCPU: 32,
    memory: 128,
    cache: 976,
    availibleZones: ["1", "2", "3"],
  };

  static StorageOptimizedMediumStandardEC8adsv5: IComputeSpecification = {
    skuName: "Standard_EC8ads_v5",
    workload: "Storage optimized",
    series: "ECadsv5 Series",
    size: "Medium",
    vCPU: 8,
    memory: 64,
    cache: 240,
    availibleZones: ["1", "3"],
  };

  static StorageOptimizedMediumStandardEC8asv51TBPS: IComputeSpecification = {
    skuName: "Standard_EC8as_v5+1TB_PS",
    workload: "Storage optimized",
    series: "ECasv5 Series",
    size: "Medium",
    vCPU: 8,
    memory: 64,
    cache: 1024,
    availibleZones: ["1", "3"],
  };

  static StorageOptimizedMediumStandardEC8asv52TBPS: IComputeSpecification = {
    skuName: "Standard_EC8as_v5+2TB_PS",
    workload: "Storage optimized",
    series: "ECasv5 Series",
    size: "Medium",
    vCPU: 8,
    memory: 64,
    cache: 2048,
    availibleZones: ["1", "3"],
  };

  static StorageOptimizedLargeStandardEC16adsv5: IComputeSpecification = {
    skuName: "Standard_EC16ads_v5",
    workload: "Storage optimized",
    series: "ECadsv5 Series",
    size: "Large",
    vCPU: 16,
    memory: 128,
    cache: 485,
    availibleZones: ["1", "3"],
  };

  static StorageOptimizedLargeStandardEC16asv54TBPS: IComputeSpecification = {
    skuName: "Standard_EC16as_v5+4TB_PS",
    workload: "Storage optimized",
    series: "ECasv5 Series",
    size: "Large",
    vCPU: 16,
    memory: 128,
    cache: 4096,
    availibleZones: ["1", "3"],
  };

  static StorageOptimizedLargeStandardEC16asv53TBPS: IComputeSpecification = {
    skuName: "Standard_EC16as_v5+3TB_PS",
    workload: "Storage optimized",
    series: "ECasv5 Series",
    size: "Large",
    vCPU: 16,
    memory: 128,
    cache: 3072,
    availibleZones: ["1", "3"],
  };

  static ComputeOptimizedIsolatedStandardE80idsv4: IComputeSpecification = {
    skuName: "Standard_E80ids_v4",
    workload: "Compute optimized",
    series: "Eidsv4 Series",
    size: "Isolated",
    vCPU: 80,
    memory: 504,
    cache: 32670,
    availibleZones: ["1", "2", "3"],
  };

  static ComputeOptimizedMediumStandardE8av4: IComputeSpecification = {
    skuName: "Standard_E8a_v4",
    workload: "Compute optimized",
    series: "Eav4/Easv4 Series",
    size: "Medium",
    vCPU: 8,
    memory: 64,
    cache: 140,
    availibleZones: ["1", "2", "3"],
  };

  static ComputeOptimizedMediumStandardE8adsv5: IComputeSpecification = {
    skuName: "Standard_E8ads_v5",
    workload: "Compute optimized",
    series: "Eadsv5 Series",
    size: "Medium",
    vCPU: 8,
    memory: 64,
    cache: 240,
    availibleZones: ["1", "2", "3"],
  };

  static StorageOptimizedMediumStandardE8asv51TBPS: IComputeSpecification = {
    skuName: "Standard_E8as_v5+1TB_PS",
    workload: "Storage optimized",
    series: "Easv5 Series",
    size: "Medium",
    vCPU: 8,
    memory: 64,
    cache: 1024,
    availibleZones: ["1", "2", "3"],
  };

  static StorageOptimizedMediumStandardE8asv52TBPS: IComputeSpecification = {
    skuName: "Standard_E8as_v5+2TB_PS",
    workload: "Storage optimized",
    series: "Easv5 Series",
    size: "Medium",
    vCPU: 8,
    memory: 64,
    cache: 2048,
    availibleZones: ["1", "2", "3"],
  };

  static StorageOptimizedMediumStandardE8asv41TBPS: IComputeSpecification = {
    skuName: "Standard_E8as_v4+1TB_PS",
    workload: "Storage optimized",
    series: "Eav4/Easv4 Series",
    size: "Medium",
    vCPU: 8,
    memory: 64,
    cache: 1024,
    availibleZones: ["1", "2", "3"],
  };

  static StorageOptimizedMediumStandardE8asv42TBPS: IComputeSpecification = {
    skuName: "Standard_E8as_v4+2TB_PS",
    workload: "Storage optimized",
    series: "Eav4/Easv4 Series",
    size: "Medium",
    vCPU: 8,
    memory: 64,
    cache: 2048,
    availibleZones: ["1", "2", "3"],
  };

  static ComputeOptimizedMediumStandardE8dv5: IComputeSpecification = {
    skuName: "Standard_E8d_v5",
    workload: "Compute optimized",
    series: "Edv5 Series",
    size: "Medium",
    vCPU: 8,
    memory: 64,
    cache: 240,
    availibleZones: ["1", "2", "3"],
  };

  static ComputeOptimizedMediumStandardE8dv4: IComputeSpecification = {
    skuName: "Standard_E8d_v4",
    workload: "Compute optimized",
    series: "Edv4 Series",
    size: "Medium",
    vCPU: 8,
    memory: 64,
    cache: 240,
    availibleZones: ["1", "2", "3"],
  };

  static StorageOptimizedMediumStandardE8sv51TBPS: IComputeSpecification = {
    skuName: "Standard_E8s_v5+1TB_PS",
    workload: "Storage optimized",
    series: "Esv5 Series",
    size: "Medium",
    vCPU: 8,
    memory: 64,
    cache: 1024,
    availibleZones: [],
  };

  static StorageOptimizedMediumStandardE8sv52TBPS: IComputeSpecification = {
    skuName: "Standard_E8s_v5+2TB_PS",
    workload: "Storage optimized",
    series: "Esv5 Series",
    size: "Medium",
    vCPU: 8,
    memory: 64,
    cache: 2048,
    availibleZones: [],
  };

  static StorageOptimizedMediumSStandardE8sv41TBPS: IComputeSpecification = {
    skuName: "Standard_E8s_v4+1TB_PS",
    workload: "Storage optimized",
    series: "Esv4 Series",
    size: "Medium",
    vCPU: 8,
    memory: 64,
    cache: 1024,
    availibleZones: ["1", "2", "3"],
  };

  static StorageOptimizedMediumStandardE8sv42TBPS: IComputeSpecification = {
    skuName: "Standard_E8s_v4+2TB_PS",
    workload: "Storage optimized",
    series: "Esv4 Series",
    size: "Medium",
    vCPU: 8,
    memory: 64,
    cache: 2048,
    availibleZones: ["1", "2", "3"],
  };

  static ComputeOptimizedSmallStandardE4av4: IComputeSpecification = {
    skuName: "Standard_E4a_v4",
    workload: "Compute optimized",
    series: "Eav4/Easv4 Series",
    size: "Small",
    vCPU: 4,
    memory: 32,
    cache: 66,
    availibleZones: ["1", "2", "3"],
  };

  static ComputeOptimizedSmallStandardE4adsv5: IComputeSpecification = {
    skuName: "Standard_E4ads_v5",
    workload: "Compute optimized",
    series: "Eadsv5 Series",
    size: "Small",
    vCPU: 4,
    memory: 32,
    cache: 116,
    availibleZones: ["1", "2", "3"],
  };

  static ComputeOptimizedSmallStandardE4dv5: IComputeSpecification = {
    skuName: "Standard_E4d_v5",
    workload: "Compute optimized",
    series: "Edv5 Series",
    size: "Small",
    vCPU: 4,
    memory: 32,
    cache: 116,
    availibleZones: ["1", "2", "3"],
  };

  static ComputeOptimizedSmallStandardE4dv4: IComputeSpecification = {
    skuName: "Standard_E4d_v4",
    workload: "Compute optimized",
    series: "Edv4 Series",
    size: "Small",
    vCPU: 4,
    memory: 32,
    cache: 116,
    availibleZones: ["1", "2", "3"],
  };

  static ComputeOptimizedLargeStandardE16av4: IComputeSpecification = {
    skuName: "Standard_E16a_v4",
    workload: "Compute optimized",
    series: "Eav4/Easv4 Series",
    size: "Large",
    vCPU: 16,
    memory: 128,
    cache: 285,
    availibleZones: ["1", "2", "3"],
  };

  static ComputeOptimizedLargeStandardE16adsv5: IComputeSpecification = {
    skuName: "Standard_E16ads_v5",
    workload: "Compute optimized",
    series: "Eadsv5 Series",
    size: "Large",
    vCPU: 16,
    memory: 128,
    cache: 485,
    availibleZones: ["1", "2", "3"],
  };

  static StorageOptimizedLargeStandardE16asv54TBPS: IComputeSpecification = {
    skuName: "Standard_E16as_v5+4TB_PS",
    workload: "Storage optimized",
    series: "Easv5 Series",
    size: "Large",
    vCPU: 16,
    memory: 128,
    cache: 4096,
    availibleZones: ["1", "2", "3"],
  };

  static StorageOptimizedLargeStandardE16asv53TBPS: IComputeSpecification = {
    skuName: "Standard_E16as_v5+3TB_PS",
    workload: "Storage optimized",
    series: "Easv5 Series",
    size: "Large",
    vCPU: 16,
    memory: 128,
    cache: 3072,
    availibleZones: ["1", "2", "3"],
  };

  static StandardE16asv44TBPS: IComputeSpecification = {
    skuName: "Standard_E16as_v4+4TB_PS",
    workload: "Storage optimized",
    series: "Eav4/Easv4 Series",
    size: "Large",
    vCPU: 16,
    memory: 128,
    cache: 4096,
    availibleZones: ["1", "2", "3"],
  };

  static StorageOptimizedLargeStandardE16asv43TBPS: IComputeSpecification = {
    skuName: "Standard_E16as_v4+3TB_PS",
    workload: "Storage optimized",
    series: "Eav4/Easv4 Series",
    size: "Large",
    vCPU: 16,
    memory: 128,
    cache: 3072,
    availibleZones: ["1", "2", "3"],
  };

  static ComputeOptimizedLargeStandardE16dv5: IComputeSpecification = {
    skuName: "Standard_E16d_v5",
    workload: "Compute optimized",
    series: "Edv5 Series",
    size: "Large",
    vCPU: 16,
    memory: 128,
    cache: 485,
    availibleZones: ["1", "2", "3"],
  };

  static ComputeOptimizedLargeStandardE16dv4: IComputeSpecification = {
    skuName: "Standard_E16d_v4",
    workload: "Compute optimized",
    series: "Edv4 Series",
    size: "Large",
    vCPU: 16,
    memory: 128,
    cache: 485,
    availibleZones: ["1", "2", "3"],
  };

  static StandardE16sv54TBPS: IComputeSpecification = {
    skuName: "Standard_E16s_v5+4TB_PS",
    workload: "Storage optimized",
    series: "Esv5 Series",
    size: "Large",
    vCPU: 16,
    memory: 128,
    cache: 4096,
    availibleZones: [],
  };

  static StorageOptimizedLargeStorageOptimizedLargeStandardE16sv53TBPS: IComputeSpecification =
    {
      skuName: "Standard_E16s_v5+3TB_PS",
      workload: "Storage optimized",
      series: "Esv5 Series",
      size: "Large",
      vCPU: 16,
      memory: 128,
      cache: 3072,
      availibleZones: [],
    };

  static StorageOptimizedLargeStandardE16sv44TBPS: IComputeSpecification = {
    skuName: "Standard_E16s_v4+4TB_PS",
    workload: "Storage optimized",
    series: "Esv4 Series",
    size: "Large",
    vCPU: 16,
    memory: 128,
    cache: 4096,
    availibleZones: ["1", "2", "3"],
  };

  static StorageOptimizedLargeStandardE16sv43TBPS: IComputeSpecification = {
    skuName: "Standard_E16s_v4+3TB_PS",
    workload: "Storage optimized",
    series: "Esv4 Series",
    size: "Large",
    vCPU: 16,
    memory: 128,
    cache: 3072,
    availibleZones: ["1", "2", "3"],
  };

  static ComputeOptimizedIsolatedStandardE64iv3: IComputeSpecification = {
    skuName: "Standard_E64i_v3",
    workload: "Compute optimized",
    series: "Eiv3 Series",
    size: "Isolated",
    vCPU: 64,
    memory: 432,
    cache: 1126,
    availibleZones: ["1", "2", "3"],
  };

  static ComputeOptimizedExtraSmallStandardE2av4: IComputeSpecification = {
    skuName: "Standard_E2a_v4",
    workload: "Compute optimized",
    series: "Eav4/Easv4 Series",
    size: "Extra Small",
    vCPU: 2,
    memory: 16,
    cache: 30,
    availibleZones: ["1", "2", "3"],
  };

  static ComputeOptimizedExtraSmallStandardE2adsv5: IComputeSpecification = {
    skuName: "Standard_E2ads_v5",
    workload: "Compute optimized",
    series: "Eadsv5 Series",
    size: "Extra Small",
    vCPU: 2,
    memory: 16,
    cache: 55,
    availibleZones: ["1", "2", "3"],
  };

  static ComputeOptimizedExtraSmallStandardE2dv5: IComputeSpecification = {
    skuName: "Standard_E2d_v5",
    workload: "Compute optimized",
    series: "Edv5 Series",
    size: "Extra Small",
    vCPU: 2,
    memory: 16,
    cache: 55,
    availibleZones: ["1", "2", "3"],
  };

  static ComputeOptimizedExtraSmallStandardE2dv4: IComputeSpecification = {
    skuName: "Standard_E2d_v4",
    workload: "Compute optimized",
    series: "Edv4 Series",
    size: "Extra Small",
    vCPU: 2,
    memory: 16,
    cache: 55,
    availibleZones: ["1", "2", "3"],
  };

  static StorageOptimizedMediumStandardL8asv3: IComputeSpecification = {
    skuName: "Standard_L8as_v3",
    workload: "Storage optimized",
    series: "Lasv3 Series",
    size: "Medium",
    vCPU: 8,
    memory: 64,
    cache: 1750,
    availibleZones: [],
  };

  // static StorageOptimizedMediumStandardL8s: IComputeSpecification = {
  //   skuName: "Standard_L8s",
  //   workload: "Storage optimized",
  //   series: "Lasv3 Series",
  //   size: "Medium",
  //   vCPU: 8,
  //   memory: 64,
  //   cache: 1750,
  //   availibleZones: [],
  // }

  static StorageOptimizedMediumStandardL8sv3: IComputeSpecification = {
    skuName: "Standard_L8s_v3",
    workload: "Storage optimized",
    series: "Lasv3 Series",
    size: "Medium",
    vCPU: 8,
    memory: 64,
    cache: 1750,
    availibleZones: [],
  };

  // static StandardL8sv2: IComputeSpecification = {
  //   skuName: "Standard_L8s_v2",
  //   workload: "Storage optimized",
  //   series: "Lasv2 Series",
  //   size: "Medium",
  //   vCPU: 8,
  //   memory: 64,
  //   cache: 1750,
  //   availibleZones: [],
  // }

  // static StandardL4s: IComputeSpecification = {
  //   skuName: "Standard_L4s",
  //   workload: "Storage optimized",
  //   series: "Lasv2 Series",
  //   size: "Small",
  //   vCPU: 4,
  //   memory: 32,
  //   cache: 850,
  //   availibleZones: [],
  // }

  static StorageOptimizedLargeStandardL16asv3: IComputeSpecification = {
    skuName: "Standard_L16as_v3",
    workload: "Storage optimized",
    series: "Lasv3 Series",
    size: "Large",
    vCPU: 16,
    memory: 128,
    cache: 3500,
    availibleZones: [],
  };

  // static StandardL16s: IComputeSpecification = {
  //   skuName: "Standard_L16s",
  //   workload: "Storage optimized",
  //   series: "Lasv2 Series",
  //   size: "Large",
  //   vCPU: 16,
  //   memory: 128,
  //   cache: 3500,
  //   availibleZones: [],
  // }

  static StorageOptimizedLargeStandardL16sv3: IComputeSpecification = {
    skuName: "Standard_L16s_v3",
    workload: "Storage optimized",
    series: "Lasv3 Series",
    size: "Large",
    vCPU: 16,
    memory: 128,
    cache: 3500,
    availibleZones: [],
  };

  // static StandardL16sv2: IComputeSpecification = {
  //   skuName: "Standard_L16s_v2",
  //   workload: "Storage optimized",
  //   series: "Lasv2 Series",
  //   size: "Large",
  //   vCPU: 16,
  //   memory: 128,
  //   cache: 3500,
  //   availibleZones: [],
  // }

  static StorageOptimizedExtraLargeStandardL32asv3: IComputeSpecification = {
    skuName: "Standard_L32as_v3",
    workload: "Storage optimized",
    series: "Lasv3 Series",
    size: "Extra Large",
    vCPU: 32,
    memory: 256,
    cache: 7000,
    availibleZones: [],
  };

  static StorageOptimizedExtraLargeStandardL32sv3: IComputeSpecification = {
    skuName: "Standard_L32s_v3",
    workload: "Storage optimized",
    series: "Lasv3 Series",
    size: "Extra Large",
    vCPU: 32,
    memory: 256,
    cache: 7000,
    availibleZones: [],
  };
}
