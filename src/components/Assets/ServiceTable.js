import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
import { serviceColumn } from '../Common/tables';

import { DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';

import * as moment from 'moment';

export default class ServiceTable extends Component {
    constructor() {
        super();

        this.assetsRef = DB.doc(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/items/NHpcf3KvPZefO6fxSvwP/service-history/kpOr1yzFO2T9a6kKylSJ`);

        this.unsubscribeAssets = null;

        this.tableData = JSON.parse(window.localStorage.getItem("assets"));
        
        this.state = {
            loadingAssets: true,
            assets: [],
            dropdownAssetsOpen: false
        };
    }

    componentDidMount() {
      this.unsubscribeAssets = this.assetsRef.onSnapshot(this.onAssetsUpdate);
      if(window.localStorage.getItem("assets") !== null){
        this.tableData = JSON.parse(window.localStorage.getItem("assets"));
      } else {
        this.tableData = {
            columns:[]
        }
      }

      this.userOrgTableData = JSON.parse(window.localStorage.getItem("assets_columns"));
      this.tableData.columns = serviceColumn.concat(this.tableData.columns);

      if(this.userOrgTableData){
        this.userOrgTableData.hidden_columns.forEach(function(indexToHide){
          this.tableData.columns[indexToHide].options.display = false;
        });
      }
    }
    
    componentWillUnmount() {
        this.unsubscribeAssets();
    }

    onAssetsUpdate = (querySnapshot) => {
        let asset = querySnapshot.data()

        if(asset.delivered) {
            asset.delivred = moment(asset.delivered.toDate()).format("DD.MM.YYYY");
         } 
         if(asset.received) {
            asset.received = moment(asset.received.toDate()).format("DD.MM.YYYY");
         }
         
        this.setState({
            asset: asset,
            loadingAsset: false,
        }); 
    }
    

    render() {
        const options = {
            filterType: 'multiselect',
            pagination: true,
            selectableRows: false,
            textLabels: {
                body: {
                  noMatch: "Fant ingen matchende elementer",
                  toolTip: "Sorter",
                },
                pagination: {
                  next: "Neste Side",
                  previous: "Forrige Side",
                  rowsPerPage: "Rader per side:",
                  displayRows: "av",
                },
                toolbar: {
                  search: "Søk",
                  downloadCsv: "Last ned CSV",
                  print: "Print",
                  viewColumns: "Vis Kolonner",
                  filterTable: "Filtrer Tabell",
                },
                filter: {
                  all: "Alle",
                  title: "FILTERE",
                  reset: "GJENNOPPRETT",
                },
                viewColumns: {
                  title: "Vis Kolonner",
                  titleAria: "Vis/Skjul Tabell Kolonner",
                },
                selectedRows: {
                  text: "rad(er) valgt",
                  delete: "Slett",
                  deleteAria: "Slett Valgte Rader",
                },
            }
        };

        if(this.state.loadingAssets){
            return <div className="ball-pulse" style={{ textAlign: 'center' }}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>;
        }

        return (
            <MUIDataTable
                title={this.props.title}
                data={this.state.assets}
                columns={this.tableData.columns}
                options={options}
            />
        );

    }
}
