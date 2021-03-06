import { Component, ViewEncapsulation, HostBinding, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { ApiService } from '../../services/api.service';
import { FormBuilder } from '@angular/forms';
import { DetailsService } from '../../services/details.service';
import { ApplicationStateService } from '../../services/application-state.service';
import { WalletService } from '../../services/wallet.service';
import { CoinService } from 'src/app/services/coin.service';
import { Subscription } from 'rxjs';

import { CoinAsset } from 'src/app/classes/coin-asset';
import { NotificationService } from 'src/app/services/notification.service';
import { P2pb2bAsset } from 'src/app/classes/p2pb2b2-asset';
import { AppModes } from 'src/app/shared/app-modes';
import { LocaleService } from 'src/app/services/locale.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {
    @HostBinding('class.dashboard') hostClass = true;
    public walletInfo = 'When you send, balance can\ntemporarily go from confirmed\nto unconfirmed.';
    public tickerInfo = 'Change to the next ticker.';
    public coins: CoinAsset[] = new Array<CoinAsset>();
    public selectedCoinTicker: CoinAsset;

    private selectedCoinTickerIndex = -1;
    private subscriptions: Subscription[];
    public searchInput = '';

    constructor(
        private apiService: ApiService,
      //  private coincap: CoincapService,
        private coin: CoinService,
        public globalService: GlobalService,
        public appState: ApplicationStateService,
        public notifications: NotificationService,
        private detailsService: DetailsService,
        public wallet: WalletService,
        public appModes: AppModes,
        private fb: FormBuilder,
        public localeService: LocaleService) {

        // Make sure we update wallet at higher frequency.
        this.wallet.active = true;
    }

    ngOnInit() {
    }

   changeTicker(change) {
        this.selectedCoinTickerIndex += change;

        if (this.selectedCoinTickerIndex < 0) {
            this.selectedCoinTickerIndex = (this.coins.length - 1);
        } else if (this.selectedCoinTickerIndex >= this.coins.length) {
            this.selectedCoinTickerIndex = 0;
        }
        this.selectedCoinTicker = this.coins[this.selectedCoinTickerIndex];
    }

    lookup() {

    }

    private mapP2pb2bToAsset(coin: P2pb2bAsset): CoinAsset {

        const asset: CoinAsset = {
            changePercent24Hr: coin.change,
            marketCap: '0',
            maxSupply: '0',
            price: coin.last,
            volume24Hr: coin.volume,
            symbol: 'DIVER',
            name: 'Divergenti',
            pair: coin.pair,
            volumepair: coin.volumepair
        };

        return asset;
    }



    private cancelSubscriptions() {
        if (!this.subscriptions) {
            return;
        }

        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }

    /** Called to cancel and restart all subscriptions. */
    private reactivate() {
        this.cancelSubscriptions();
    }

    ngOnDestroy() {
        // When navigate away from dashboard, we'll make the wallet update more slowly.
        this.wallet.active = false;
        this.cancelSubscriptions();
    }
}
