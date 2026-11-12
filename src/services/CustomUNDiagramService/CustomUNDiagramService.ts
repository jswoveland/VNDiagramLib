import type UtilityNetwork from "@arcgis/core/networks/UtilityNetwork";
import { canExecute, command } from "@vertigis/web/messaging";
import type {MessageBus, FeaturesLike } from "@vertigis/web/messaging";
import {FrameworkServiceType, inject, ServiceBase  } from "@vertigis/web/services";


/**
 * Interface that defines the parameter of the "network.create-diagram-from-features" operation.
 */
export interface CreateDiagramFromFeaturesParams {
    
    /**
     * An array of utility network features.
     */
    features: FeaturesLike;

    /**
     * The utility network, which owns the features.
     */
    utilityNetwork?: UtilityNetwork | string;

    
    /**
     * The template to apply to the diagram: "Basic" (default), "ExpandContainers",
     * "CollapseContainers" or a custom name.
     */
    template?: string;

    /**
     * The token (guid) used to lock the version.
     */
    sessionId?: string;

    /**
     * The geodatabase version on which the operation will be performed.
     */
    gdbVersion?: string;
}

/**
 * Interface that defines the results of the "network.create-diagram-from-features" operation.
 */
export interface CreateDiagramFromFeaturesResults extends CreateDiagramFromFeaturesParams {
    /**
     * The utility network, which owns the diagram.
     */
    utilityNetwork: UtilityNetwork;

    /**
     * The result of the operation.
     */
    diagramInfo: any;
}

/**
 * Interface to the "network.add-diagram" command.
 */
export interface AddDiagramParams {
    /**
     * The utility network, which owns the diagram.
     */
    utilityNetwork: UtilityNetwork | string;

    /**
     * The information about the diagram.
     */
    diagramInfo: any;

    /**
     * The token (guid) used to lock the version.
     */
    sessionId?: string;

    /**
     * The geodatabase version on which the operation will be performed.
     */
    gdbVersion?: string;
}

export default class CustomUNDiagramService extends ServiceBase {
  
   
  @inject(FrameworkServiceType.MESSAGE_BUS)
  protected messageBus: MessageBus;


  @canExecute("CustomUNDiagramService.AddDiagramFromResults")
  protected _canAAddDiagramFromResults(args: FeaturesLike): boolean {
    return true;
  }

  @command("CustomUNDiagramService.AddDiagramFromResults")
  protected async _doAction(args: FeaturesLike): Promise<void> {
    console.log(
      "Executing CustomUNDiagramService.AddDiagramFromResults"
    );

   
    const createDiagramFromFeaturesParams: CreateDiagramFromFeaturesParams = {
      features: args,
    };

    try {
      const diagramResults: CreateDiagramFromFeaturesResults = await this.messageBus
        .operation<CreateDiagramFromFeaturesParams>("network.create-diagram-from-features")
        .execute(createDiagramFromFeaturesParams);

      if (!diagramResults) {
        console.error("Diagram creation returned no results");
        return;
      }

      console.log("Diagram created successfully");
      await this.messageBus
        .command<AddDiagramParams>("network.add-diagram")
        .execute(diagramResults).then(async () => {
          console.log("Diagram added successfully");
          await this.messageBus.command<any>("ui.activate").execute({"component": "item://map-extension/network-diagram-map-config"});
        }).catch((error) => {
          console.error("Error adding diagram:", error);
        });
    } catch (error) {   
      console.error("Error creating diagram:", error);
    }
  }
}
