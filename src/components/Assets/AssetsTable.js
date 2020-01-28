import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
import { assetsColumn } from '../Common/tables';

import { DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';

import * as moment from 'moment';

export default class AssetsTable extends Component {
    constructor() {
        super();

        this.assetsRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/contacts`);
        
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
      this.tableData.columns = assetsColumn.concat(this.tableData.columns);

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
        let assets = [];

        
          querySnapshot.forEach((doc) => {
            var assetsObj = doc.data();
            assetsObj.key = doc.id;
  

             /*if(assetsObj.date_scrapped) {
                assetsObj.date_scrapped = moment(assetsObj.date_scrapped.toDate()).format("DD.MM.YYYY");
             } 
             if(assetsObj.date_bought) {
                assetsObj.date_bought = moment(assetsObj.date_bought.toDate()).format("DD.MM.YYYY");
             }*/
             
              assets.push(assetsObj);
          });
        

        this.setState({
            assets,
            loadingAssets: false,
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
