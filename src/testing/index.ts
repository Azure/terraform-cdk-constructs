import { Construct } from "constructs";
import * as cdktf from "cdktf";
import { TerraformStack} from "cdktf";


export class BaseTestStack extends TerraformStack {
    public readonly name: string;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        const name = new cdktf.TerraformVariable(this, "name", {
            type: "string",
            default: "test",
            description: "System name used to randomize the resources",
          });

        this.name = name.value;
    }
}
