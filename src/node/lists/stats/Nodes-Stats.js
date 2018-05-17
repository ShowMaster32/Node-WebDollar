import consts from 'consts/const_global'
import NodesList from 'node/lists/Nodes-List'
import GeoLocationLists from 'node/lists/geolocation-lists/geolocation-lists'
import NodesWaitlist from 'node/lists/waitlist/Nodes-Waitlist'
import CONNECTIONS_TYPE from "node/lists/types/Connections-Type"
import Blockchain from "main-blockchain/Blockchain"

class NodesStats {

    // socket : null,

    constructor(){

        this.statsClients = 0;
        this.statsServer = 0;
        this.statsWebPeers = 0;

        this.statsWaitlistFullNodes = 0;
        this.statsWaitlistLightNodes = 0;

        NodesList.emitter.on("nodes-list/connected", (nodesListObject) => { this._recalculateStats(nodesListObject, false ) } );
        NodesList.emitter.on("nodes-list/disconnected", (nodesListObject ) => { this._recalculateStats(nodesListObject, false ) });

        NodesWaitlist.emitter.on("waitlist/new-node", (nodesListObject ) => { this._recalculateStats(nodesListObject, false ) });
        NodesWaitlist.emitter.on("waitlist/delete-node", (nodesListObject ) => { this._recalculateStats(nodesListObject, false ) });

        setInterval( this._printStats.bind(this), consts.SETTINGS.PARAMS.STATUS_INTERVAL)
    }

    _printStats(){

        console.info(" blocks: ", Blockchain.blockchain.blocks.length);
        console.log(" connected to: ", this.statsClients," , from: ", this.statsServer , " web peers", this.statsWebPeers," Network FullNodes:",this.statsWaitlistFullNodes, " Network LightNodes:",this.statsWaitlistLightNodes, "    GeoLocationContinents: ", GeoLocationLists.countGeoLocationContinentsLists );


        let string1 = "";
        let clients = NodesList.getNodesByConnectionType(CONNECTIONS_TYPE.CONNECTION_CLIENT_SOCKET);
        for (let i=0; i<clients.length; i++)
            string1 += '('+clients[i].socket.node.sckAddress.toString() + ')   ';

        let string2 = "";
        let server = NodesList.getNodesByConnectionType( CONNECTIONS_TYPE.CONNECTION_SERVER_SOCKET );
        for (let i=0; i<server.length; i++)
            string2 += '(' + server[i].socket.node.sckAddress.toString() + ')   ';

        console.log("clients: ",string1);
        console.log("server: ",string2);


        // let waitlist1 = [];
        // for ( let i=0; i<NodesWaitlist.waitListFullNodes.length; i++ )
        //     if ( ! NodesWaitlist.waitListFullNodes[i].isFallback) {
        //         let obj = NodesWaitlist.waitListFullNodes[i].toJSON();
        //         obj.score = NodesWaitlist.waitListFullNodes[i].sortingScore();
        //         obj.connected = NodesWaitlist.waitListFullNodes[i].connected;
        //         waitlist1.push(obj);
        //     }
        //
        // let waitlist2 = [];
        // for ( let i=0; i<NodesWaitlist.waitListLightNodes.length; i++ )
        //     if ( ! NodesWaitlist.waitListLightNodes[i].isFallback) {
        //         let obj = NodesWaitlist.waitListLightNodes[i].toJSON();
        //         obj.score = NodesWaitlist.waitListLightNodes[i].sortingScore();
        //         obj.connected = NodesWaitlist.waitListLightNodes[i].connected;
        //         waitlist2.push(obj);
        //     }

        console.log("waitlist full node ", NodesWaitlist.waitListFullNodes.length);
        console.log("waitlist full node ", NodesWaitlist.waitListLightNodes.length);

    }

    _recalculateStats(nodesListObject, printStats = true){

        this.statsClients = NodesList.countNodesByConnectionType(CONNECTIONS_TYPE.CONNECTION_CLIENT_SOCKET);
        this.statsServer = NodesList.countNodesByConnectionType(CONNECTIONS_TYPE.CONNECTION_SERVER_SOCKET);
        this.statsWebPeers = NodesList.countNodesByConnectionType(CONNECTIONS_TYPE.CONNECTION_WEBRTC);

        this.statsWaitlistFullNodes= NodesWaitlist.waitListFullNodes.length;
        this.statsWaitlistLightNodes = NodesWaitlist.waitListLightNodes.length;

        if (printStats)
            this._printStats();

    }
}

export default new NodesStats();