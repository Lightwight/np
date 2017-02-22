/*
*   This software called - np - is a lightwight MVP Framework for building web applications and
*   was developed by Christian Peters
*
*   Copyright (C) 2016 Christian Peters
*
*   This program is free software: you can redistribute it and/or modify
*   it under the terms of the GNU General Public License as published by
*   the Free Software Foundation, either version 3 of the License, or
*   (at your option) any later version.
*
*   This program is distributed in the hope that it will be useful,
*   but WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*   GNU General Public License for more details.
*
*   You should have received a copy of the GNU General Public License
*   along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
*   Contact: Christian Peters <c.peters.eshop@gmail.com>
*/

np.view.extend ('ProductDependenciesView', {
    didInsert: function () {
        var _this;

        _this       = this;

        this ('#dependendProducts-carousel').owlCarousel ({
            nav:            true, 
            dots:           false,
            margin:         15,
            stagePadding:   5,
            mouseDrag:      false,
            navText:        ['',''],
            responsive: {
                0:  {
                    items: 1,
                    slideBy: 1
                },
                600:  {
                    items: 2,
                    slideBy: 2
                },
                1000:  {
                    items: 3,
                    slideBy: 3
                },
                1200: {
                    items: 4,
                    slideBy: 4
                },
                1600: {
                    items: 4,
                    slideBy: 4
                }
            }
        });
    }
});